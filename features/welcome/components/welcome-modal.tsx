type TProps = {
      isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export function WelcomeModal({ isOpen, onClose, onGetStarted }: TProps) {

  if (!isOpen) return null;

  const features = [
    {
      emoji: '👁️',
      title: 'Live Preview',
      description: 'See your resume update in real-time',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      emoji: '🎨',
      title: 'Pro Templates',
      description: 'Industry-specific layouts',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      emoji: '⬇️',
      title: 'Export PDF',
      description: 'Download instantly',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      emoji: '⚡',
      title: 'ATS Optimized',
      description: 'Beat tracking systems',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  const tips = [
    'Start with personal info and work backwards chronologically',
    'Use action verbs and quantify achievements',
    'Keep to 1-2 pages for maximum impact',
    'Tailor skills to match job descriptions'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-5xl w-full max-h-[95vh] shadow-2xl border flex flex-col">
        <div className="relative flex flex-col h-full">
          {/* Header Section */}
          <div className="relative p-6 pb-4 text-center bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-t-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-xl">
                  <span className="text-xl">📄</span>
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="p-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to Resume Builder! 🚀
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Create professional, ATS-optimized resumes in minutes. Join thousands who've landed their dream positions.
              </p>
            </div>

            <div className="flex justify-center flex-wrap gap-2 mt-3">
              <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded text-sm gap-1 inline-flex items-center">
                <span>✨</span>
                100% Free
              </span>
              <span className="bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 rounded text-sm gap-1 inline-flex items-center">
                <span>🛡️</span>
                Privacy First
              </span>
              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-1 rounded text-sm gap-1 inline-flex items-center">
                <span>👥</span>
                500K+ Users
              </span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6">
            {/* Features Section */}
            <div className="py-4">
              <h3 className="text-lg font-semibold text-center mb-4 text-foreground">
                Everything you need to build the perfect resume
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default rounded-lg"
                  >
                    <div className="p-4 text-center h-full flex flex-col">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.gradient} p-2 mx-auto mb-3 shadow-lg hover:scale-110 hover:rotate-3 transition-transform duration-200 flex items-center justify-center text-white text-lg`}>
                        {feature.emoji}
                      </div>
                      <h4 className="font-semibold mb-1 text-sm text-foreground">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips Section */}
              <div className="bg-muted/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-sm">ℹ️</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">Pro Tips for Success</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-sm">🗄️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1 text-sm">
                      About Data Persistence
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed mb-2">
                      Start building immediately without an account! Data saves locally in your browser. 
                      For access anywhere, create a free account.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <span>🕐</span>
                      <span>Local saves last until you clear browser data</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="p-6 pt-4 bg-background border-t border-border/50 rounded-b-lg">
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                onClick={onGetStarted}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg px-6 py-2.5 text-sm font-medium hover:scale-105 transition-transform duration-200 rounded-lg inline-flex items-center justify-center"
              >
                <span>✨</span>
                Start Building Now
                <span>→</span>
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3">
              <button
                className="gap-2 border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 px-4 py-2 text-sm hover:scale-105 transition-transform duration-200 rounded-lg inline-flex items-center justify-center"
                onClick={() => {
                  // Placeholder for register functionality
                  window.open('/register', '_blank');
                }}
              >
                <span>👤+</span>
                Register
              </button>

              <button
                className="gap-2 border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 px-4 py-2 text-sm hover:scale-105 transition-transform duration-200 rounded-lg inline-flex items-center justify-center"
                onClick={() => {
                  // Placeholder for login functionality
                  window.open('/login', '_blank');
                }}
              >
                <span>🔐</span>
                Login
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              No signup required to get started • Your privacy is protected
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="animate-spin" style={{ animationDuration: '20s' }}>
              <span className="text-primary text-lg">✨</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <div className="animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
              <span className="text-secondary text-base">⭐</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-12 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close welcome modal"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
