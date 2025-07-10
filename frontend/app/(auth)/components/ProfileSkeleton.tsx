import { Card, CardContent } from "@/components/ui/card"

export const ProfileSkeleton = () => (
  <div className="container mx-auto px-20 max-w-5xl animate-pulse">
    <div className="text-center mb-8">
      <div className="h-10 bg-gray-300 rounded-md w-1/3 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
    </div>
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-purple-500/10 overflow-hidden">
      <div className="relative h-32 bg-gray-300">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 rounded-full bg-gray-400 border-4 border-white"></div>
        </div>
      </div>
      <CardContent className="pt-20 pb-8">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-300 rounded-md w-1/2 mx-auto mb-1"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/3 mx-auto"></div>
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded-md"></div>
          <div className="h-10 bg-gray-200 rounded-md"></div>
          <div className="h-10 bg-gray-200 rounded-md"></div>
        </div>
      </CardContent>
    </Card>
  </div>
);
