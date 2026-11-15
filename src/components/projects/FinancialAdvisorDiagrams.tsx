import { financialAdvisor as study } from '../../data/financialAdvisor'
import { FinanceDiagram, FlowSequence } from './FinancialAdvisorDiagramParts'

export { ToolCallingDiagram } from './FinancialAdvisorToolFlow'

export function TaxImplementationDiagram() {
  return (
    <FinanceDiagram
      label="Schematic tax implementation: income fields and categorized deductions enter calculate_tax through its schema. Python applies expense deductions, individual and grouped constraints, and donation handling, then returns flat-tax and progressive-tax outputs with deduction details."
      caption="Schematic of the tax implementation. The schema guides input extraction; Python owns the calculation rules."
    >
      <FlowSequence steps={study.taxSteps} horizontal />
    </FinanceDiagram>
  )
}

export function ValidationPathsDiagram() {
  return (
    <FinanceDiagram
      label="Two schematic validation paths, not captured execution logs. Function execution: inspect the selected function and arguments, then compare the numeric tool output with Kasikornbank’s calculator. Direct text generation: the model answers without calling a function, so no calculator execution is established for that answer."
      caption="Schematic paths for interpreting the manual checks; these are not captured runs or evidence of a pass rate."
    >
      <div className="finance-validation-paths">
        <div>
          <h3>Function execution</h3>
          <FlowSequence steps={[
            { title: 'Inspect function + arguments', detail: 'Check the selected tool and extracted inputs' },
            { title: 'Compare numeric output', detail: 'Use Kasikornbank’s calculator as a reference' },
          ]} />
        </div>
        <div>
          <h3>Direct text generation</h3>
          <FlowSequence steps={[
            { title: 'No function call', detail: 'The model writes an answer directly' },
            { title: 'Execution not established', detail: 'A fluent answer does not verify a calculation' },
          ]} />
        </div>
      </div>
    </FinanceDiagram>
  )
}

export function FutureFinanceDiagram() {
  return (
    <FinanceDiagram
      label="Proposed future flow, not implemented: versioned sources and documents feed retrieval and validation; calculators apply reviewed rules; results cite their sources and versions."
      caption="Proposed future flow. Document retrieval, current-data integrations, validation, and cited results remain future work."
    >
      <FlowSequence horizontal steps={[
        { title: 'Sources & documents', detail: 'Track origin, version, and date' },
        { title: 'Retrieval & validation', detail: 'Find relevant evidence and check inputs' },
        { title: 'Calculators', detail: 'Execute reviewed financial rules' },
        { title: 'Cited results', detail: 'Explain the calculation with sources' },
      ]} />
    </FinanceDiagram>
  )
}
