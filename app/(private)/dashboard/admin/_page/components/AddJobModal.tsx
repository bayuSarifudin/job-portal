import { ReactNode } from "react";
import { CreateJobSchema, createJobSchema } from "../validation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ComboboxStatic } from "@/components/reusable/combobox-static";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from "@/components/ui/spinner";
import { UseFormReturn } from "react-hook-form";
import RichTextarea from "@/components/reusable/TextEditor";

interface Props {
  fields: any[];
  handleSubmit: (data: CreateJobSchema) => void;
  loading: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<CreateJobSchema>;
  children?: ReactNode;
}

const CreateJob = ({ fields, handleSubmit, loading, open, setOpen, form, children }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? children : <Button className='w-full mt-6'>Create a new job</Button>}
      </DialogTrigger>
      <DialogContent className='w-full min-w-[900px] max-w-[900px]'>
        <DialogHeader className='border-b'>
          <DialogTitle>Job Opening?</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form} schema={createJobSchema}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-h-[85dvh] overflow-auto">
            <div className="px-6 py-4 space-y-6">
              <FormField
                control={form.control}
                name="job_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex. Front End Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <FormControl>
                      <ComboboxStatic
                        values={[
                          { value: 'Full Time', label: 'Full Time' },
                          { value: 'Part Time', label: 'Part Time' },
                          { value: 'Freelance', label: 'Freelance' },
                          { value: 'Contract', label: 'Contract' },
                        ]}
                        placeholder="job type"
                        onValueChange={field.onChange}
                        selectedValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <RichTextarea
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Ex. Responsible for building..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="candidate_needed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Candidates Needed</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value ?? ""}
                        placeholder="Ex. 2"
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? "" : Number(v));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value ?? ""}
                          placeholder="Rp. 0"
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(v === "" ? "" : Number(v));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value ?? ""}
                          placeholder="Rp. 0"
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(v === "" ? "" : Number(v));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">Minimum Profile Information Required</h3>
                <div className="flex flex-col gap-2">
                  {fields.map((f: any, i: number) => (
                    <FormField
                      key={f.id}
                      control={form.control}
                      name={`requirements.${i}.requirement_type`}
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="font-normal">{f.field_name}</FormLabel>
                          <div className="flex gap-2">
                            {(["mandatory", "optional", "off"] as const).map((opt) => (
                              <Button
                                key={opt}
                                type="button"
                                variant={"outline"}
                                onClick={() => field.onChange(opt)}
                                className={`rounded-2xl ${field.value === opt ? 'border-primary-main text-primary-main' : 'border-neutral-40 text-neutral-90'}`}
                              >
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </Button>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full bg-neutral-10 h-[82px] sticky -bottom-4 left-0 flex items-center justify-end border-t border-neutral-40">
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : "Publish Job"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  );
};

export default CreateJob;
