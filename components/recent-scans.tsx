import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Star } from "lucide-react"

export function RecentScans() {
  const recentScans = [
    {
      name: "Tide Laundry Detergent",
      rating: 4.3,
      time: "1 hour ago",
      image: "https://www.google.com/imgres?q=tide%20laundry%20detergent&imgurl=https%3A%2F%2Fimages.ctfassets.net%2Fajjw8wywicb3%2F7itBn56qJDuAgKOVba3ZRx%2Fd5499bbcfe1c7c62e7b9f27d93e9de80%2FTide_Powder_Original_hero_SP_748x748.jpg%3Ffm%3Dpng&imgrefurl=https%3A%2F%2Ftide.com%2Fen-us%2Fshop%2Ftype%2Fpowder%2Ftide-original-powder&docid=dzIGfxF9cL4RjM&tbnid=_tRZU7GwF84A-M&vet=12ahUKEwiAneeLna2PAxX2cmwGHQs6GekQM3oECCgQAA..i&w=748&h=748&hcb=2&ved=2ahUKEwiAneeLna2PAxX2cmwGHQs6GekQM3oECCgQAA",
    },
    {
      name: "Himalaya Herbal Toothpaste",
      rating: 4.7,
      time: "2 hours ago",
      image: "https://www.google.com/imgres?q=himalaya%20herbal%20toothpaste&imgurl=https%3A%2F%2Fonemg.gumlet.io%2Fl_watermark_346%2Cw_480%2Ch_480%2Fa_ignore%2Cw_480%2Ch_480%2Cc_fit%2Cq_auto%2Cf_auto%2Foqhj9kt9phbujer9ehrp.jpg%3Fdpr%3D2%26format%3Dauto&imgrefurl=https%3A%2F%2Fwww.1mg.com%2Fotc%2Fhimalaya-complete-care-toothpaste-otc340149%3Fsrsltid%3DAfmBOorwmphs4sa0Wfk-RE8LkjHnFQTqHVTw4w9UizlC_MxIh9eCtEgK&docid=Vn-Iy3G5xRtrFM&tbnid=SxBKFhAr3EfMaM&vet=12ahUKEwjBjZW0na2PAxXGW2wGHW4XDowQM3oECBcQAA..i&w=480&h=257&hcb=2&ved=2ahUKEwjBjZW0na2PAxXGW2wGHW4XDowQM3oECBcQAA",
    },
    {
      name: "LG Washing Machine",
      rating: 4.1,
      time: "5 hours ago",
      image: "https://www.google.com/aclk?sa=L&ai=DChsSEwj539TTna2PAxW91RYFHakoDhQYACICCAEQCRoCdGw&co=1&ase=2&gclid=Cj0KCQjw_L_FBhDmARIsAItqgt4mhOsylvFnotT1qXs0zl16zIaWlxzeh4xMXGOdHmTsktMfiV5Zlj0aAnAaEALw_wcB&cce=2&category=acrcp_v1_32&sig=AOD64_3kxXNCe3A4INnzFAmRJewzWjNjvw&ctype=5&q=&nis=4&ved=2ahUKEwilg87Tna2PAxXEhlYBHWz0N54Q9aACKAB6BAgEEDU&adurl=",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Recent Scans</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentScans.map((scan, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <img
                src={scan.image || "/placeholder.svg"}
                alt={scan.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{scan.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{scan.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">{scan.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
