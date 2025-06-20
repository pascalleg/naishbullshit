interface DeleteAccountStepsProps {
  currentStep: number
}

export function DeleteAccountSteps({ currentStep }: DeleteAccountStepsProps) {
  const steps = [
    { step: 1, label: "Feedback" },
    { step: 2, label: "Review" },
    { step: 3, label: "Confirm" },
  ]

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        {steps.map((item) => (
          <div key={item.step} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= item.step
                  ? currentStep === item.step
                    ? "bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple"
                    : "bg-ethr-neonblue"
                  : "bg-ethr-darkgray"
              }`}
            >
              <span className={currentStep >= item.step ? "text-ethr-black font-bold" : "text-muted-foreground"}>
                {item.step}
              </span>
            </div>
            <span className={`text-sm mt-2 ${currentStep >= item.step ? "text-white" : "text-muted-foreground"}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-2 bg-ethr-darkgray rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
