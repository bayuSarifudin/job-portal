"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useApplicant } from './_page/hook';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DataTable } from '@/components/reusable/data-table';
import { columns } from './_page/column';
import { Spinner } from '@/components/ui/spinner';
import EmptyState from '@/components/reusable/EmptyState';

const ManageJob = ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | undefined; }>;
}) => {
  const query = React.use(searchParams);
  const router = useRouter();

  const { applicant, job, loading } = useApplicant({ jobId: query?.jobId as string });

  return (
    <div className="w-full py-6">
      {!loading && (
        <div className="pb-6">
          <section id="header" className="flex items-center justify-start gap-4">
            <Button variant={'outline'} onClick={() => router.back()}><ArrowLeft /></Button>
            <h2 className="text-xl font-bold text-neutral-100">{job?.job_name}</h2>
          </section>
        </div>
      )}
      {!loading ? (
        applicant?.length > 0 ? (
          <div className='border p-4 rounded-xl'>
            <DataTable data={applicant} columns={columns} />
          </div>
        ) : (
          <EmptyState src='/emptyCandidate.png' title="No candidates found" description='Share your job vacancies so that more candidates will apply.' />
        )
      ) : (
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ManageJob;