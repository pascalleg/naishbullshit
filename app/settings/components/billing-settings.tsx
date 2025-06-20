"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, Loader2, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BillingSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card-1")
  const [showAddCard, setShowAddCard] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setShowAddCard(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Billing & Subscription</h2>
        <p className="text-muted-foreground mb-6">Manage your subscription plan and payment methods.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Plan</h3>

          <div className="p-6 border border-ethr-neonblue rounded-md bg-ethr-neonblue/5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h4 className="text-xl font-semibold">Pro Plan</h4>
                  <Badge className="ml-2 bg-ethr-neonblue text-ethr-black">Current</Badge>
                </div>
                <p className="text-muted-foreground mt-1">$29.99 per month</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-ethr-neonblue"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Unlimited booking requests
                  </li>
                  <li className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-ethr-neonblue"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Featured profile placement
                  </li>
                  <li className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-ethr-neonblue"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-ethr-neonblue"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Priority support
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                >
                  Change Plan
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-muted text-muted-foreground hover:bg-ethr-darkgray hover:text-white"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-muted text-sm text-muted-foreground">
              Your subscription will renew on May 29, 2025
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Payment Methods</h3>
            <Button
              variant="outline"
              size="sm"
              className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
              onClick={() => setShowAddCard(!showAddCard)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Payment Method
            </Button>
          </div>

          {showAddCard ? (
            <div className="p-4 border border-muted rounded-md bg-ethr-black space-y-4">
              <h4 className="font-medium">Add New Card</h4>

              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input id="card-name" placeholder="John Smith" className="bg-ethr-darkgray border-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <div className="relative">
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="bg-ethr-darkgray border-muted pl-10"
                  />
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" className="bg-ethr-darkgray border-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" className="bg-ethr-darkgray border-muted" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  className="border-muted text-muted-foreground hover:bg-ethr-darkgray hover:text-white"
                  onClick={() => setShowAddCard(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    "Add Card"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
                <RadioGroupItem value="card-1" id="card-1" />
                <Label htmlFor="card-1" className="flex-1 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Visa ending in 4242</span>
                    <p className="text-sm text-muted-foreground">Expires 04/26</p>
                  </div>
                </Label>
                <Badge className="ml-auto bg-ethr-neonblue/20 text-ethr-neonblue border-none">Default</Badge>
              </div>

              <div className="flex items-center space-x-3 rounded-md border border-muted p-4 bg-ethr-black">
                <RadioGroupItem value="card-2" id="card-2" />
                <Label htmlFor="card-2" className="flex-1 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Mastercard ending in 5678</span>
                    <p className="text-sm text-muted-foreground">Expires 08/25</p>
                  </div>
                </Label>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-white">
                  Remove
                </Button>
              </div>
            </RadioGroup>
          )}
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Billing Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="country" className="bg-ethr-black border-muted">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Select defaultValue="ca">
                <SelectTrigger id="state" className="bg-ethr-black border-muted">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input id="address1" defaultValue="123 Music Street" className="bg-ethr-black border-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input id="address2" placeholder="Apartment, suite, etc." className="bg-ethr-black border-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" defaultValue="Los Angeles" className="bg-ethr-black border-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP / Postal Code</Label>
              <Input id="zip" defaultValue="90001" className="bg-ethr-black border-muted" />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Billing History</h3>

          <div className="rounded-md border border-muted overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-ethr-darkgray">
                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  <tr className="bg-ethr-black">
                    <td className="px-4 py-3 text-sm">Apr 29, 2025</td>
                    <td className="px-4 py-3 text-sm">Pro Plan - Monthly</td>
                    <td className="px-4 py-3 text-sm">$29.99</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Paid</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </td>
                  </tr>
                  <tr className="bg-ethr-black">
                    <td className="px-4 py-3 text-sm">Mar 29, 2025</td>
                    <td className="px-4 py-3 text-sm">Pro Plan - Monthly</td>
                    <td className="px-4 py-3 text-sm">$29.99</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Paid</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </td>
                  </tr>
                  <tr className="bg-ethr-black">
                    <td className="px-4 py-3 text-sm">Feb 29, 2025</td>
                    <td className="px-4 py-3 text-sm">Pro Plan - Monthly</td>
                    <td className="px-4 py-3 text-sm">$29.99</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Paid</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              className="border-muted text-muted-foreground hover:bg-ethr-darkgray hover:text-white"
            >
              View All Invoices
            </Button>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
