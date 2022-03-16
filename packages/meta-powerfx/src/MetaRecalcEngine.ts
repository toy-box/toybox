import {
  BuiltinFunctionsCore,
  IScope,
  Library,
  PowerFxConfig,
  PowerFxConfigExtensions,
  RecalcEngineDocument,
  FormulaValue,
  ExpandPath,
  FormulaType,
  RecordType,
  RecordValue,
  RecalcGlue,
  TexlParserFlags,
  DKind,
  FormulaTypeStatic,
  IRTranslator,
  ParsedExpression,
} from '@toy-box/power-fx'
import { TexlBinding } from '@toy-box/power-fx/lib/binding'
import { DataSourceToQueryOptionsMap } from '@toy-box/power-fx/lib/entities/queryOptions/DataSourceToQueryOptionsMap'
import { Glue2DocumentBinderGlue } from '@toy-box/power-fx/lib/glue/Glue'
import { TexlLexer } from '@toy-box/power-fx/lib/lexer'
import { Span } from '@toy-box/power-fx/lib/localization'
import { CheckResult, IPowerFxEngine } from '@toy-box/power-fx/lib/public'
import { Formula } from '@toy-box/power-fx/lib/syntax/Formula'
import { MetaResolver } from './MetaResolver'

export declare type ValueResolve = (name: string) => FormulaValue

export interface MetaRecalcEngineProps {
  powerFxConfig?: PowerFxConfig
  document?: RecalcEngineDocument
}

export abstract class MetaRecalcEngine implements IScope, IPowerFxEngine {
  private readonly _powerFxConfig: PowerFxConfig
  private readonly _document: RecalcEngineDocument
  private resolve: ValueResolve

  constructor(powerFxConfig?: PowerFxConfig, document?: RecalcEngineDocument) {
    powerFxConfig = powerFxConfig ?? new PowerFxConfigExtensions()
    this.addInterpreterFunctions(powerFxConfig)
    this._powerFxConfig = powerFxConfig
    this._document = document
  }

  // Add Builtin functions that aren't yet in the shared library.
  private addInterpreterFunctions(powerFxConfig: PowerFxConfig) {
    powerFxConfig.addFunction(BuiltinFunctionsCore.Index_UO)
    powerFxConfig.addFunction(BuiltinFunctionsCore.ParseJson)
    powerFxConfig.addFunction(BuiltinFunctionsCore.Table_UO)
    powerFxConfig.addFunction(BuiltinFunctionsCore.Text_UO)
    powerFxConfig.addFunction(BuiltinFunctionsCore.Value_UO)
    powerFxConfig.addFunction(BuiltinFunctionsCore.Boolean)
    powerFxConfig.addFunction(BuiltinFunctionsCore.Boolean_UO)
  }

  public getAllFunctionNames() {
    return [
      ...this._powerFxConfig.extraFunctions.keys(),
      ...Library.FunctionList.map((fn) => fn.name),
    ]
  }

  public check(
    expressionText: string,
    parameterType?: FormulaType,
    path?: ExpandPath
  ): CheckResult {
    return this.checkInternal(expressionText, parameterType, path, false)
  }

  private checkInternal(
    expressionText: string,
    parameterType?: FormulaType,
    path?: ExpandPath,
    intellisense: boolean = false
  ) {
    if (parameterType == null) {
      parameterType = new RecordType()
    }
    const formula = new Formula(expressionText)
    formula.ensureParsed(TexlParserFlags.All)
    // Ok to continue with binding even if there are parse errors.
    // We can still use that for intellisense.

    const resolver = new MetaResolver(
      this,
      this._powerFxConfig,
      parameterType as RecordType,
      this._document,
      path
    )

    const binding = TexlBinding.Run({
      glue: new RecalcGlue(),
      queryOptionsMap: new DataSourceToQueryOptionsMap(),
      node: formula.parseTree,
      resolver,
      ruleScope: parameterType._type,
    })
    const errors = formula.hasParseErrors
      ? formula.getParseErrors()
      : binding.errorContainer.getErrors()

    const result = new CheckResult()
    result._binding = binding
    result._formula = formula

    if (errors != null && errors.length > 0) {
      result.setErrors(errors)
      result.expression = undefined
    } else {
      result.topLevelIdentifiers = DependencyFinder.FindDependencies(
        binding.top,
        binding
      )

      // TODO: Fix FormulaTypeStatic.Build to not throw exceptions for Enum types then remove this check
      if (binding.resultType.kind != DKind.Enum) {
        result.returnType = FormulaTypeStatic.Build(binding.resultType)
      }
      const { topNode: irnode, ruleScopeSymbol } = IRTranslator.Translate(
        result._binding
      )
      result.expression = new ParsedExpression(irnode, ruleScopeSymbol)
    }
    return result
  }

  /// <summary>
  /// Evaluate an expression as text and return the result.
  /// </summary>
  /// <param name="expressionText">textual representation of the formula.</param>
  /// <param name="parameters">parameters for formula. The fields in the parameter record can
  /// be acecssed as top-level identifiers in the formula.</param>
  /// <returns>The formula's result.</returns>
  public eval(
    expressionText: string,
    parameters?: RecordValue,
    path?: ExpandPath
  ): FormulaValue {
    if (parameters == null) {
      parameters = RecordValue.Empty()
    }

    const check = this.check(
      expressionText,
      parameters.irContext.resultType,
      path
    )
    check.throwOnErrors()

    return check.expression.eval(parameters)
  }

  public getInvariantExpression(
    expressionText: string,
    parameters: RecordType
  ): string {
    return this.convertExpression(expressionText, parameters, false)
  }

  /// <summary>
  /// Convert references in an expression to the display form.
  /// </summary>
  /// <param name="expressionText">textual representation of the formula.</param>
  /// <param name="parameters">Type of parameters for formula. The fields in the parameter record can
  /// be acecssed as top-level identifiers in the formula. If DisplayNames are used, make sure to have that mapping
  /// as part of the RecordType.
  /// <returns>The formula, with all identifiers converted to display form</returns>
  public getDisplayExpression(
    expressionText: string,
    parameters: RecordType
  ): string {
    return this.convertExpression(expressionText, parameters, true)
  }

  private convertExpression(
    expressionText: string,
    parameters: RecordType,
    toDisplayNames: boolean
  ): string {
    const formula = new Formula(expressionText)
    formula.ensureParsed(TexlParserFlags.None)

    const resolver = new MetaResolver(this, this._powerFxConfig, parameters)
    const binding = TexlBinding.Run({
      glue: new Glue2DocumentBinderGlue(),
      queryOptionsMap: new DataSourceToQueryOptionsMap(),
      node: formula.parseTree,
      resolver,
      ruleScope: parameters._type,
      useThisRecordForRuleScope: false,
      updateDisplayNames: toDisplayNames,
      forceUpdateDisplayNames: toDisplayNames,
    })

    const worklist = new Map<Span, string>()
    for (const token of binding.nodesToReplace) {
      worklist.set(token.key.Span, TexlLexer.EscapeName(token.value))
    }
    return Span.ReplaceSpans(
      expressionText,
      Array.from(worklist.entries()).map((v) => ({ key: v[0], value: v[1] }))
    )
  }
}
