import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl mb-2">Joshua AI Robotics</CardTitle>
          <CardDescription className="text-xl">
            Joint Open Source Hub for Universal Automation
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Construction in progress... Please check back soon!</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
