import React from 'react';

const AnalyticsPage = () => {
    return (
        <div>
            <h1>Analytics Page</h1>
            <p>Welcome to the Analytics page!</p>
        </div>
    );
};

export default AnalyticsPage;

/*import { useEffect } from 'react';
import mermaid from 'mermaid';

export default function BudgetFlowchart() {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
    });
    mermaid.contentLoaded();
  }, []);

  return (
    <div className="mermaid-diagram">
      <div className="mermaid">
        {`
        flowchart TD
            A[Business Budget Input] --> B{Budget Analysis}
            B --> C[Budget Tier Classification]
            C --> D[Athlete Matching Algorithm]
            
            D --> E[Low Budget Option]
            D --> F[Medium Budget Option]
            D --> G[High Budget Option]
            
            E --> H[2-3 Micro-Athletes]
            E --> I[1 Post per Week]
            E --> J[Basic Analytics]
            
            F --> K[4-6 Micro-Athletes]
            F --> L[2 Posts per Week]
            F --> M[Advanced Analytics]
            
            G --> N[7+ Micro-Athletes]
            G --> O[3+ Posts per Week]
            G --> P[Premium Analytics + Campaign Management]
            
            H & I & J --> Q[Expected ROI: 120-150%]
            K & L & M --> R[Expected ROI: 150-200%]
            N & O & P --> S[Expected ROI: 200%+]
            
            Q & R & S --> T[Campaign Execution]
            T --> U[Performance Tracking]
            U --> V[ROI Analysis]
            V --> W[Budget Adjustment Recommendations]
            W --> B
        `}
      </div>
    </div>
  );
}*/