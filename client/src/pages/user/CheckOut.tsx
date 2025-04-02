

import { useState } from "react"
import { ArrowLeft, CreditCard, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Footer from "@/components/user/common/Footer"
import Navbar from "@/components/user/common/Navbar"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { StripePayment } from "@/services/paymentService"
import { toast } from "sonner"

export default function CheckoutPage() {

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate();
    const { courses, error } = useSelector((state: RootState) => state.courses) // Access courses from Redux
    const course = courses.find((c) => c._id === id);


  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading,setIsLoading]=useState(false)
  

  if(!id){
    return <div>Course not found</div>
  }

  if (!course) {
    return <div>Course not found</div>; // Fallback if course isn't found
  }

  const originalPrice = parseFloat(course.price)
  const discountedPrice = couponApplied ? originalPrice - originalPrice * (discount / 100) : originalPrice;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "welcome10") {
      setCouponApplied(true);
      setDiscount(10);
    } else if (couponCode.toLowerCase() === "special20") {
      setCouponApplied(true);
      setDiscount(20);
    } else {
      alert("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode("");
    setDiscount(0);
  };


  const handleStripePayment = async () => {
    try {
      setIsLoading(true)
      const response = await StripePayment(id,discountedPrice,couponCode)
      if(response){

        window.location.href = response.data.url
      }
    } catch (error:any) {
      console.error('Error initiating Stripe payment:', error,"pattiii");
      console.log(error.response.data.message,"error.response.data.message");
      
      toast.error(error.response.data.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <>
    <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Course
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>Complete your purchase to gain access to this course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Credit Card
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="stripe" id="stripe" className="peer sr-only" />
                    <Label
                      htmlFor="stripe"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500"
                    >
                      <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M19.0803 7.916C19.1088 7.67 19.1088 7.424 19.0803 7.178C18.9193 5.466 17.5683 4 15.8523 4H8.1483C7.4193 4 6.7473 4.35 6.3523 4.92C6.1913 5.166 6.0863 5.454 6.0573 5.768C5.8393 7.178 5.2233 11.232 5.1663 11.684C5.1663 11.712 5.1663 11.74 5.1663 11.768C5.1663 12.544 5.7823 13.16 6.5583 13.16H9.0143C9.2893 13.16 9.5363 13.328 9.6413 13.58L10.4173 15.36C10.5223 15.612 10.7693 15.78 11.0443 15.78H12.9553C13.6843 15.78 14.3563 15.43 14.7513 14.86C14.9123 14.608 15.0173 14.32 15.0463 14.006C15.2643 12.596 15.8803 8.542 15.9373 8.09C15.9373 8.062 15.9373 8.034 15.9373 8.006C15.9373 7.23 15.3213 6.614 14.5453 6.614H12.0893C11.8143 6.614 11.5673 6.446 11.4623 6.194L10.6863 4.414C10.5813 4.162 10.3343 3.994 10.0593 3.994H8.1483"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.9197 11.916C17.9482 11.67 17.9482 11.424 17.9197 11.178C17.7587 9.466 16.4077 8 14.6917 8H6.9877C6.2587 8 5.5867 8.35 5.1917 8.92C5.0307 9.166 4.9257 9.454 4.8967 9.768C4.6787 11.178 4.0627 15.232 4.0057 15.684C4.0057 15.712 4.0057 15.74 4.0057 15.768C4.0057 16.544 4.6217 17.16 5.3977 17.16H7.8537C8.1287 17.16 8.3757 17.328 8.4807 17.58L9.2567 19.36C9.3617 19.612 9.6087 19.78 9.8837 19.78H11.7947C12.5237 19.78 13.1957 19.43 13.5907 18.86C13.7517 18.608 13.8567 18.32 13.8857 18.006C14.1037 16.596 14.7197 12.542 14.7767 12.09C14.7767 12.062 14.7767 12.034 14.7767 12.006C14.7767 11.23 14.1607 10.614 13.3847 10.614H10.9287C10.6537 10.614 10.4067 10.446 10.3017 10.194L9.5257 8.414C9.4207 8.162 9.1737 7.994 8.8987 7.994H6.9877"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Stripe
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                    <Label
                      htmlFor="upi"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500"
                    >
                      <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="#000000"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8.5 14.5L15.5 7.5"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.5 9.5V14.5H13.5"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      UPI
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "card" && (
                <div className="bg-secondary p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Card Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name on Card</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="johndoe@example.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "stripe" && (
                <div className="bg-secondary p-6 rounded-lg text-center">
                  <p className="mb-4">You'll be redirected to stripe to complete your payment.</p>
                  <Button  onClick={handleStripePayment} className="w-full bg-[#0070ba] hover:bg-[#005ea6]">Continue to stripe</Button>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="bg-secondary p-6 rounded-lg">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input id="upi-id" placeholder="yourname@upi" className="mb-4" />
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Verify and Pay</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="h-16 w-24 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    {/* <p className="text-sm text-muted-foreground">{course.instructor}</p> */}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Price</span>
                    <span>₹{originalPrice}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{(originalPrice * (discount / 100)).toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{discountedPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Label htmlFor="coupon">Coupon Code</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="coupon"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                    />
                    {couponApplied ? (
                      <Button variant="outline" size="icon" onClick={handleRemoveCoupon} className="shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode}
                        className="shrink-0 bg-emerald-500 hover:bg-emerald-600"
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                  {couponApplied && (
                    <p className="text-sm text-emerald-600 mt-1 flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Coupon applied successfully!
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Complete Purchase</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
   </>
  )
}

