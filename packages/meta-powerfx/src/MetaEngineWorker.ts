import { IScope } from '@toy-box/power-fx'

// This implements IScope as a means to intercept dependencies and evaluate.
export class MetaEngineWorker implements IScope {
  // recomputed values.
  private readonly _calcs = new Dictionary<string, FormulaValue>()

  // Send updates on these vars.
  // These are the ones we propagate too.
  private readonly _sendUpdates = new Set<string>()

  private readonly _parent: RecalcEngine

  private readonly _cultureInfo: CultureInfo

  constructor(parent: RecalcEngine, cultureInfo?: CultureInfo) {
    this._parent = parent
    this._cultureInfo = cultureInfo ?? CultureInfo.CurrentCulture
  }

  // Start
  public recalc(name: string) {
    this.recalcWorkerAndPropagate(name)
    // Dispatch update hooks.
    for (const varName of Array.from(this._sendUpdates).sort()) {
      const info = this._parent.formulas[varName]
      const newValue = info.value
      info.onUpdate?.(varName, newValue)
    }
  }

  // Just recalc Name.
  private recalcWorker2(name: string) {
    if (this._calcs.has(name)) {
      return // already computed.
    }

    const fi = this._parent.formulas[name]

    // Now calculate this node. Will recalc any dependencies if needed.
    if (fi.binding != null) {
      const binding = fi.binding

      let { topNode: irnode, ruleScopeSymbol } = IRTranslator.Translate(binding)
      const scope = this
      const v = new EvalVisitor(this._cultureInfo)

      const newValue = irnode.accept(v, SymbolContext.New())

      const equal =
        fi.value != null && // null on initial run.
        RuntimeHelpers.AreEqual(newValue, fi.value)

      if (!equal) {
        this._sendUpdates.add(name)
      }

      fi.value = newValue
    }

    this._calcs.set(name, fi.value)
  }

  // Recalc Name and any downstream formulas that may now be updated.
  private recalcWorkerAndPropagate(name: string) {
    this.recalcWorker2(name)
    const fi = this._parent.formulas[name]
    // Propagate changes.
    for (const x of fi.usedBy) {
      this.recalcWorkerAndPropagate(x)
    }
  }

  // Intercept any dependencies this formula has and ensure the dependencies are re-evaluated.
  resolve(name: string): FormulaValue {
    const result = this._calcs.tryGetValue(name)
    let value = result[1]
    if (!result[0]) {
      // Dependency is not yet recalced.
      this.recalcWorker2(name)
      value = this._calcs.get(name)
    }
    return value
  }
} // end class RecalcHelper
