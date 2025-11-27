import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import SignupUser from "./signup-user";
// import SignupCompany from "./signup-company";
import { FieldDescription } from "@/components/ui/field";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <SignupUser />
            {/* <Tabs defaultValue="user" className="w-full">
              <TabsList className="mb-6 grid w-full h-10 grid-cols-2">
                <TabsTrigger value="user" className="cursor-pointer">
                  User
                </TabsTrigger>
                <TabsTrigger value="company" className="cursor-pointer">
                  Company
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <SignupUser />
              </TabsContent>

              <TabsContent value="company">
                <SignupCompany />
              </TabsContent>
            </Tabs> */}
          </div>

          {/* Photo */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.pexels.com/photos/8117427/pexels-photo-8117427.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
