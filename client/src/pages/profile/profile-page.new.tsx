// This contains just the replacement "Back to Help Center" buttons
// Each button changes from:
//   onClick={() => window.history.pushState({}, '', '/profile/help')}
// To:
//   onClick={() => handleTabChange("help")}

// First button for FAQ section
<div className="flex justify-start mt-8">
  <Button
    variant="outline"
    onClick={() => handleTabChange("help")}
    className="flex items-center"
  >
    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
    Back to Help Center
  </Button>
</div>

// Second button for Suggestions section
<div className="flex justify-start mt-8">
  <Button
    variant="outline"
    onClick={() => handleTabChange("help")}
    className="flex items-center"
  >
    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
    Back to Help Center
  </Button>
</div>

// Third button for Report section
<div className="flex justify-start mt-8">
  <Button
    variant="outline"
    onClick={() => handleTabChange("help")}
    className="flex items-center"
  >
    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
    Back to Help Center
  </Button>
</div>