"use client";
import EmptyState from '@/components/reusable/EmptyState';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CreateJob from './_page/components/AddJobModal';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useJobs } from './_page/hook';
import dayjs from "dayjs";
import { cn, rupiah } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const AdminRoots = () => {
  const router = useRouter();
  const { jobs, loadingPage, statusClass: status, fields, handleSubmit, loading, open, setOpen, form } = useJobs();

  return (
    <div className='py-6 flex flex-col-reverse md:flex-row gap-5'>
      <section className='w-full'>
        <div className='relative'>
          <Input placeholder='Search by job details' className='pr-10' />
          <Search className='absolute text-primary-main right-2.5 top-[5px]' />
        </div>
        {
          loadingPage ? (
            <div className="w-full min-h-[400px] flex items-center justify-center">
              <Spinner />
            </div>
          ) : jobs.length > 0 ? (
            <div className='py-4 space-y-4'>
              {jobs?.map((job, index) => (
                <div className='space-y-3 rounded-2xl p-6 shadow-modal' key={job.id}>
                  <section className='space-x-4'>
                    <span className={cn((index + 1) % 3 === 0 ? status.draft : ((index + 1) % 2 === 0 ? status.inactive : status.active), 'px-4 py-1 rounded-lg')}>
                      {(index + 1) % 3 === 0 ? 'Draft' : ((index + 1) % 2 === 0 ? 'Inactive' : 'Active')}
                    </span>
                    <span className={'px-4 py-1 rounded-lg border border-neutral-40 text-neutral-90'}>
                      started on&nbsp;{dayjs(job?.created_at)?.format('D MMM YYYY')}
                    </span>
                  </section>
                  <section className='flex items-end justify-between'>
                    <div className='space-y-2'>
                      <h3 className='text-neutral-100 text-xl font-bold'>{job?.job_name}</h3>
                      <p className='text-neutral-80'>
                        {rupiah(job?.min_salary as number)}&nbsp;-&nbsp;{rupiah(job?.max_salary as number)}
                      </p>
                    </div>
                    <Button onClick={() => router.push(`/dashboard/admin/manage?jobId=${job?.id}`)}>Manage Job</Button>
                  </section>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>
              <CreateJob fields={fields} form={form} handleSubmit={handleSubmit} loading={loading} open={open} setOpen={setOpen} >
                <Button className="bg-anotations hover:bg-anotations/90 text-neutral-90">
                  Create a new job
                </Button>
              </CreateJob>
            </EmptyState>
          )
        }

      </section>
      <div className="w-full max-w-[300px] h-max min-h-[168px] max-h-[168px] relative bg-[url('/cardIMage.png')] bg-cover repeat-1 bg-center p-6 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black/72"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-xl font-bold text-neutral-40">Recruit the best candidate</h1>
          <p className="mt-1 font-bold text-neutral-10 text-sm">Create jobs, invite, and hire with ease</p>

          <CreateJob fields={fields} form={form} handleSubmit={handleSubmit} loading={loading} open={open} setOpen={setOpen} />
        </div>
      </div>
    </div>
  );
};

export default AdminRoots;