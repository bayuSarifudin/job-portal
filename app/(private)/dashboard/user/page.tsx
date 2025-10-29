"use client";
import EmptyState from '@/components/reusable/EmptyState';
import { useJobs } from './_page/hook';
import { Spinner } from '@/components/ui/spinner';
import { Banknote, MapPin, Truck } from 'lucide-react';
import { cn, rupiah } from '@/lib/utils';

import "./style.css";
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const UserRoot = () => {
  const router = useRouter();
  const { jobs, loadingPage, jobId, setJobId } = useJobs();

  if (loadingPage) (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <Spinner />
    </div>
  );
  if (!loadingPage && !jobs.length) (
    <EmptyState />
  );

  const selectedJobs = useMemo(() => {
    const job = jobs?.find(({ id }) => id === jobId);

    return {
      ...job,
      job_description: job?.job_description?.split('\n')?.join('<br />')?.replaceAll('-', '&bull;')
    }
  }, [jobs, jobId]);

  const onApply = (jobId?: string | number) => {
    try {
      router.push(`/dashboard/user/apply?jobId=${jobId}`)
    } catch (error) {
      toast.error(error as string)
    }
  }

  return (
    <div className='py-6 flex flex-col md:flex-row gap-5'>
      <div id='cardJobUser' className="w-full max-w-[320px] pr-5 min-h-[calc(95vh-76px)] max-h-[calc(95vh-76px)] relative overflow-y-auto space-y-4">
        {
          jobs.map((job) => (
            <div
              key={job.id}
              className={cn("border rounded-lg px-4 py-3 space-y-1", jobId === job?.id ? "border-primary-main bg-primary-surface" : "border-neutral-40 bg-neutral-10")}
              onClick={() => setJobId(job?.id)}
            >
              <div className='flex flex-row items-center justify-start gap-4 border-b border-dashed pb-2'>
                <span className='min-w-12 max-w-12 aspect-square flex items-center justify-center border border-neutral-40 rounded-md'>
                  <Truck className='text-neutral-80' />
                </span>
                <div className='space-y-1'>
                  <h3 className='text-xl font-bold text-neutral-90 line-clamp-1'>{job?.job_name} hjkhkj ghk kg jhgj</h3>
                  <h4 className='text-m text-neutral-90'>Rakamin</h4>
                </div>
              </div>
              <span className='flex items-center justify-start gap-2 text-neutral-80'>
                <MapPin className='min-w-3 max-w-3 aspect-square' />
                <p className='text-s'>Jakarta Selatan</p>
              </span>
              <span className='flex items-center justify-start gap-2 text-neutral-80'>
                <Banknote className='min-w-3 max-w-3 aspect-square' />
                <p className='text-s'>{rupiah(job?.min_salary as number)}&nbsp;-&nbsp;{rupiah(job.max_salary as number)}</p>
              </span>
            </div>
          ))
        }
      </div>
      <section className='w-full border border-neutral-40 rounded-lg p-6'>
        {!selectedJobs ? <EmptyState /> : (
          <div className='space-y-6'>
            <div className='flex flex-row items-start justify-start gap-4'>
              <span className='min-w-12 max-w-12 aspect-square flex items-center justify-center border border-neutral-40 rounded-md'>
                <Truck className='text-neutral-80' />
              </span>
              <div className='space-y-1'>
                <h5 className='text-s font-bold bg-success-main text-neutral-10 w-fit px-2 py-1 rounded-[6px]'>{selectedJobs?.job_type}</h5>
                <h3 className='text-xl font-bold text-neutral-90 line-clamp-1'>{selectedJobs?.job_name} hjkhkj ghk kg jhgj</h3>
                <h4 className='text-m text-neutral-90'>Rakamin</h4>
              </div>
              <Button className='ml-auto bg-secondary-main text-neutral-90' onClick={() => onApply(selectedJobs.id)}>Apply</Button>
            </div>

            <span className='block w-full h-px bg-neutral-40' />

            <div className='text-m text-neutral-90' dangerouslySetInnerHTML={{ __html: selectedJobs.job_description as string }} />
          </div>
        )}
      </section>
    </div>
  );
};

export default UserRoot;