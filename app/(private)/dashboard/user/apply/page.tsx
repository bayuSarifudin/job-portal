"use client";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import React from "react";
// import { useJobs } from "./_page/hook";
// import { useRouter } from "next/navigation";

// const Apply = ({ searchParams }: {
//   searchParams: Promise<{ [key: string]: string | undefined; }>;
// }) => {
//   const router = useRouter()
//   const query = React.use(searchParams);
//   const { requirement, job } = useJobs({ jobId: query?.jobId as string });

//   return (
//     <div className="py-6">
//       <section id="header" className="flex items-center justify-start gap-4">
//         <Button variant={'outline'} onClick={() => router.back()}><ArrowLeft /></Button>
//         <h2 className="text-xl font-bold text-neutral-100">{job?.job_name}</h2>
//         <div className="ml-auto flex items-center justify-end gap-2">
//           <span className="text-red-500 text-lg">*</span>
//           This field required to fill
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Apply;

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useJobs } from "./_page/hook";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Upload } from "lucide-react";
import React from "react";
import { DatePicker } from "@/components/reusable/DatePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import HandGesture from "@/components/reusable/hand-gesture";


export default function ApplyForm({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | undefined; }>;
}) {
  const router = useRouter();
  const query = React.use(searchParams);
  const { reqType, job, form, applySchema, loading, handleSubmit, open, setOpen } = useJobs({ jobId: query?.jobId as string });
  return (
    <section className="w-full flex items-start justify-center py-6">
      <div className="w-full max-w-[700px] border p-10 rounded-2xl shadow-modal">
        <div className="pb-6">
          <section id="header" className="flex items-center justify-start gap-4">
            <Button variant={'outline'} onClick={() => router.back()}><ArrowLeft /></Button>
            <h2 className="text-xl font-bold text-neutral-100">{job?.job_name}</h2>
            <div className="ml-auto flex items-center justify-end gap-2">
              <span className="text-red-500 text-lg">*</span>
              This field required to fill
            </div>
          </section>
        </div>
        <Form {...form} schema={applySchema}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Photo Profile */}
            {reqType?.photo_profile !== 'off' && (
              <>
                <FormField name="photo_profile" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo Profile</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value as string} hidden />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="space-y-4">
                  <Image className="rounded-full w-32 aspect-square object-fit-contain" width={128} height={128} src={form.getValues('photo_profile') as string || '/profile.png'} alt="profile" />
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                      <span className="cursor-pointer text-m font-bold text-neutral-100 flex items-center justify-start gap-2 shadow-button w-fit px-2 py-1 rounded-lg border border-neutral-40">
                        <Upload className="w-4 aspect-square" />
                        Take a Picture
                      </span>
                    </DialogTrigger>
                    <DialogContent className="min-w-[637px]">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-neutral-100">Raise Your Hand to Capture</DialogTitle>
                        <DialogDescription className="text-s text-neutral-100">We’ll take the photo once your hand pose is detected.</DialogDescription>
                      </DialogHeader>
                      <HandGesture form={form} setOpen={setOpen} />

                      <DialogFooter>
                        <div className="w-full flex flex-col items-center justify-start gap-4 text-s text-neutral-100">
                          <p>To take a picture, follow the hand poses in the order shown below. The system will automatically capture the image once the final pose is detected.</p>
                          <div className="flex items-center w-full justify-center gap-4">
                            <Image className="" width={16.94} height={47.32} src={"/oneOke.png"} alt="one" />
                            <ChevronRight />
                            <Image className="" width={16.94} height={47.32} src={"/twoOke.png"} alt="two" />
                            <ChevronRight />
                            <Image className="" width={16.94} height={47.32} src={"/threeOke.png"} alt="three" />
                          </div>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}

            {/* Full Name */}
            {reqType?.full_name !== 'off' && (
              <FormField name="full_name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} value={field?.value as string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* Date of Birth */}
            {reqType?.date_of_birth !== 'off' && (
              <FormField name="date_of_birth" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value as Date}
                      onDateChange={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* Gender */}
            {reqType?.gender !== 'off' && (
              <FormField name="gender" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                      className="flex flex-row items-center justify-start gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">She/Her (Female)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">He/Him (Male)</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* Domicile */}
            {reqType?.domicile !== 'off' && (
              <FormField name="domicile" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Domicile</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} value={field.value as string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* Email */}
            {reqType?.email !== 'off' && (
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@mail.com" {...field} value={field.value as string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* Phone Number */}
            {reqType?.phone_number !== 'off' && (
              <FormField name="phone_number" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="08xxxxxxxxxx" {...field} value={field.value as string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* LinkedIn */}
            {reqType?.linkedin_link !== 'off' && (
              <FormField name="linkedin_link" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/..." {...field} value={field.value as string} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}