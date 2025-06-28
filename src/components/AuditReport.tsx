
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Info, Download, Loader2, FileText } from "lucide-react";
import { AuditResult } from "@/pages/Index";

interface AuditReportProps {
  auditResults: AuditResult[];
  isLoading: boolean;
  contractName: string;
}

export const AuditReport = ({ auditResults, isLoading, contractName }: AuditReportProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Shield className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800';
    }
  };

  const criticalIssues = auditResults.filter(r => r.severity === 'critical');
  const highIssues = auditResults.filter(r => r.severity === 'high');
  const mediumIssues = auditResults.filter(r => r.severity === 'medium');
  const lowIssues = auditResults.filter(r => r.severity === 'low' || r.severity === 'info');

  const generateDetailedReport = () => {
    const timestamp = new Date().toLocaleString();
    const securityScore = Math.max(0, 100 - (criticalIssues.length * 25 + highIssues.length * 15 + mediumIssues.length * 10 + lowIssues.length * 5));
    
    const reportContent = `
========================================
    SMART CONTRACT SECURITY AUDIT REPORT
========================================

Contract Name: ${contractName}
Audit Date: ${timestamp}
Security Score: ${securityScore}/100

========================================
EXECUTIVE SUMMARY
========================================

Total Issues Found: ${auditResults.length}
- Critical: ${criticalIssues.length}
- High: ${highIssues.length} 
- Medium: ${mediumIssues.length}
- Low/Info: ${lowIssues.length}

Security Assessment: ${
  securityScore >= 90 ? 'EXCELLENT - Contract appears secure with minimal issues' :
  securityScore >= 75 ? 'GOOD - Minor security concerns identified' :
  securityScore >= 50 ? 'MODERATE - Several security issues require attention' :
  securityScore >= 25 ? 'POOR - Significant security vulnerabilities found' :
  'CRITICAL - Severe security risks identified'
}

========================================
DETAILED FINDINGS
========================================

${auditResults.map((issue, index) => `
${index + 1}. ${issue.title}
   Severity: ${issue.severity.toUpperCase()}
   Category: ${issue.category}
   Line: ${issue.lineNumber}
   
   Description:
   ${issue.description}
   
   Recommendation:
   ${issue.suggestion}
   
   Impact: ${
     issue.severity === 'critical' ? 'Immediate action required - Contract funds at risk' :
     issue.severity === 'high' ? 'High priority - Significant security concern' :
     issue.severity === 'medium' ? 'Medium priority - Should be addressed before deployment' :
     'Low priority - Best practice improvement'
   }
   
   ${'='.repeat(60)}
`).join('')}

========================================
SECURITY RECOMMENDATIONS
========================================

1. IMMEDIATE ACTIONS (Critical/High Issues):
${criticalIssues.concat(highIssues).length === 0 ? 
  '   ✓ No critical or high severity issues found' :
  criticalIssues.concat(highIssues).map(issue => `   • ${issue.title} (Line ${issue.lineNumber})`).join('\n')
}

2. RECOMMENDED IMPROVEMENTS (Medium Issues):
${mediumIssues.length === 0 ? 
  '   ✓ No medium severity issues found' :
  mediumIssues.map(issue => `   • ${issue.title} (Line ${issue.lineNumber})`).join('\n')
}

3. BEST PRACTICES (Low/Info Issues):
${lowIssues.length === 0 ? 
  '   ✓ No low severity issues found' :
  lowIssues.map(issue => `   • ${issue.title} (Line ${issue.lineNumber})`).join('\n')
}

========================================
GENERAL SECURITY BEST PRACTICES
========================================

• Implement proper access controls and role-based permissions
• Use OpenZeppelin's audited contracts when possible
• Implement circuit breakers for emergency situations
• Follow the checks-effects-interactions pattern
• Use reentrancy guards for external calls
• Implement proper error handling and validation
• Consider using a multi-signature wallet for admin functions
• Regular security audits and code reviews
• Comprehensive testing including edge cases
• Monitor contract behavior post-deployment

========================================
DISCLAIMER
========================================

This audit report is based on automated analysis and should not be 
considered as a substitute for manual security review by qualified 
security professionals. The absence of findings does not guarantee 
the security of the smart contract. Deploy at your own risk.

Report generated by SecureAudit - Smart Contract Security Analyzer
Generated on: ${timestamp}
    `;

    return reportContent;
  };

  const downloadReport = () => {
    const reportContent = generateDetailedReport();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName.replace('.sol', '')}_SecurityAudit_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSONReport = () => {
    const jsonReport = {
      contractName,
      auditDate: new Date().toISOString(),
      summary: {
        totalIssues: auditResults.length,
        critical: criticalIssues.length,
        high: highIssues.length,
        medium: mediumIssues.length,
        low: lowIssues.length,
        securityScore: Math.max(0, 100 - (criticalIssues.length * 25 + highIssues.length * 15 + mediumIssues.length * 10 + lowIssues.length * 5))
      },
      findings: auditResults,
      recommendations: auditResults.map(r => ({
        title: r.title,
        suggestion: r.suggestion,
        severity: r.severity,
        lineNumber: r.lineNumber
      }))
    };

    const blob = new Blob([JSON.stringify(jsonReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName.replace('.sol', '')}_SecurityAudit_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex items-center justify-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <div className="text-center">
              <p className="text-lg font-medium">Generating Comprehensive Audit Report...</p>
              <p className="text-muted-foreground">Advanced security analysis in progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const securityScore = Math.max(0, 100 - (criticalIssues.length * 25 + highIssues.length * 15 + mediumIssues.length * 10 + lowIssues.length * 5));

  return (
    <div className="space-y-6">
      {/* Enhanced Summary with Security Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Audit Summary</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button onClick={downloadReport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button onClick={downloadJSONReport} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-1">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                <div className="text-4xl font-bold mb-2" style={{
                  color: securityScore >= 90 ? '#10b981' : 
                         securityScore >= 75 ? '#f59e0b' : 
                         securityScore >= 50 ? '#f97316' : '#ef4444'
                }}>
                  {securityScore}/100
                </div>
                <div className="text-sm font-medium text-muted-foreground">Security Score</div>
                <div className="text-xs mt-2 px-3 py-1 rounded-full" style={{
                  backgroundColor: securityScore >= 90 ? '#dcfce7' : 
                                  securityScore >= 75 ? '#fef3c7' : 
                                  securityScore >= 50 ? '#fed7aa' : '#fecaca',
                  color: securityScore >= 90 ? '#166534' : 
                         securityScore >= 75 ? '#92400e' : 
                         securityScore >= 50 ? '#c2410c' : '#b91c1c'
                }}>
                  {securityScore >= 90 ? 'EXCELLENT' : 
                   securityScore >= 75 ? 'GOOD' : 
                   securityScore >= 50 ? 'MODERATE' : 'NEEDS ATTENTION'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4 md:col-span-2">
              <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-2xl font-bold text-red-600">{criticalIssues.length}</div>
                <div className="text-sm text-red-600 font-medium">Critical</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="text-2xl font-bold text-orange-600">{highIssues.length}</div>
                <div className="text-sm text-orange-600 font-medium">High</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-2xl font-bold text-yellow-600">{mediumIssues.length}</div>
                <div className="text-sm text-yellow-600 font-medium">Medium</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600">{lowIssues.length}</div>
                <div className="text-sm text-blue-600 font-medium">Low</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Quick Assessment:</h4>
            <p className="text-sm text-muted-foreground">
              {securityScore >= 90 ? 'Excellent security posture! This contract demonstrates strong security practices with minimal issues.' :
               securityScore >= 75 ? 'Good security overall with some minor concerns that should be addressed.' :
               securityScore >= 50 ? 'Moderate security concerns identified. Review and fix issues before deployment.' :
               securityScore >= 25 ? 'Significant security vulnerabilities found. Immediate attention required.' :
               'Critical security risks detected. Do not deploy without comprehensive security review.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {auditResults.map((result) => (
          <Card key={result.id} className={`border-l-4 ${getSeverityColor(result.severity)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getSeverityIcon(result.severity)}
                  <div>
                    <h3 className="font-semibold">{result.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={
                        result.severity === 'critical' ? 'bg-red-500 hover:bg-red-600' :
                        result.severity === 'high' ? 'bg-orange-500 hover:bg-orange-600' :
                        result.severity === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-blue-500 hover:bg-blue-600'
                      }>
                        {result.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{result.category}</Badge>
                      <span className="text-sm text-muted-foreground">Line {result.lineNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Description</h4>
                  <p className="text-muted-foreground">{result.description}</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">
                    Recommended Solution
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">{result.suggestion}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>Impact:</strong> {
                    result.severity === 'critical' ? 'Immediate action required - Contract funds may be at risk' :
                    result.severity === 'high' ? 'High priority - Significant security concern that should be addressed' :
                    result.severity === 'medium' ? 'Medium priority - Should be resolved before deployment' :
                    'Low priority - Best practice improvement recommended'
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {auditResults.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Excellent Security Posture!
            </h3>
            <p className="text-muted-foreground mb-6">
              Your smart contract appears to be secure based on our comprehensive analysis. 
              No security vulnerabilities were detected.
            </p>
            <div className="flex justify-center space-x-2">
              <Button onClick={downloadReport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Clean Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
