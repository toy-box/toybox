import {
  Control,
  DName,
  DPath,
  ExpandPath,
  PowerFxConfig,
  RecalcEngineDocument,
  RecordType,
} from '@toy-box/power-fx'
import { BindKind, NameLookupPreferences } from '@toy-box/power-fx/lib/binding'
import { NameLookupInfo } from '@toy-box/power-fx/lib/binding/bindingInfo'
import {
  IExternalEntityScope,
  IsIExternalOptionSet,
} from '@toy-box/power-fx/lib/entities/external'
import { SimpleResolver } from '@toy-box/power-fx/lib/glue/SimpleResolver'
import { IPowerFxEngine } from '@toy-box/power-fx/lib/public'
import { IMetaBase } from '@toy-box/meta-schema'
import { MakeFormulaValue } from './metaValue'
import { MakeDType } from './metaType'

/// </summary>
export abstract class MetaResolver extends SimpleResolver {
  private readonly _parent: IPowerFxEngine
  private readonly _powerFxConfig: PowerFxConfig
  private readonly _currentPath: DPath

  constructor(
    parent: IPowerFxEngine,
    powerFxConfig: PowerFxConfig,
    document?: RecalcEngineDocument,
    path?: ExpandPath
  ) {
    super(
      powerFxConfig.enumStore.enumSymbols,
      Array.from(powerFxConfig.extraFunctions.values())
    )
    this._powerFxConfig = powerFxConfig
    this._parent = parent
    this._document = document
    this._currentPath = path ? path.toDPath() : this._currentPath
  }

  public get currentEntityPath() {
    return this._currentPath
  }

  public get currentEntity() {
    if (this.currentEntityPath && this.document) {
      return this.document.globalScope.tryGetEntity<Control>(
        this.currentEntityPath.name
      )[1]
    }
  }

  public get entityScope(): IExternalEntityScope {
    return this._document.globalScope
  }

  public lookup(
    name: DName,
    preferences = NameLookupPreferences.None
  ): [boolean, NameLookupInfo] {
    // Kinds of globals:
    // - global formula
    // - parameters
    // - environment symbols

    let nameInfo: NameLookupInfo
    const str = name.value
    if (str === 'ThisItem' && this.currentEntity) {
      const thisItemPath = this.currentEntity.topParentOrSelf
        .isDataComponentDefinition
        ? this.currentEntityPath.parent
        : this.currentEntityPath

      return [
        true,
        new NameLookupInfo(
          BindKind.ThisItem,
          this.currentEntity.thisItemType,
          thisItemPath,
          0,
          this.currentEntity.topParentOrSelf,
          this.currentEntity.topParentOrSelf.entityName
        ),
      ]
    }
    const fieldMeta = this.getMetasIn(str)
    if (fieldMeta != null) {
      const type = MakeDType(fieldMeta)
      const data = MakeFormulaValue(this.getMetasIn(str), this.getValuesIn(str))
      nameInfo = new NameLookupInfo(
        BindKind.PowerFxResolvedObject,
        type,
        DPath.Root,
        0,
        data
      )
      return [true, nameInfo]
    }

    const result = this._powerFxConfig.environmentSymbols.tryGetValue(name)
    const symbol = result[1]
    if (result[0]) {
      // Special case symbols
      if (IsIExternalOptionSet(symbol)) {
        nameInfo = new NameLookupInfo(
          BindKind.OptionSet,
          symbol.type,
          DPath.Root,
          0,
          symbol
        )

        return [true, nameInfo]
      } else {
        // throw new NotImplementedException($"{symbol.GetType().Name} not supported by {typeof(RecalcEngineResolver).Name}");
        throw new Error(`${symbol} not supported by ${this}`)
      }
    }

    return super.lookup(name, preferences)
  }

  public lookupDataControl(
    name: DName
  ): [boolean, { lookupInfo: NameLookupInfo; dataControlName: DName }] {
    if (name.value === 'ThisItem') {
      const lookupInfo = new NameLookupInfo(
        BindKind.Control,
        this.currentEntity.thisItemType,
        DPath.Root,
        0,
        this.currentEntity.topParentOrSelf,
        this.currentEntity.topParentOrSelf.entityName
      )
      return [
        true,
        { lookupInfo, dataControlName: this.currentEntity.entityName },
      ]
    }
    return [false, undefined]
  }

  public abstract getValuesIn(pattern: string): any
  public abstract getMetasIn(pattern: string): IMetaBase
}
