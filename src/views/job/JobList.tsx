import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteJob, fetchAllJobs } from '../../api/job'
import { type TJob } from './types/jobTypes';
import { Link } from 'react-router-dom';


export default function JobList() {
 const {data, isError, error, isLoading} = useQuery(
    {
        queryKey: ['jobs'],
        queryFn: fetchAllJobs
    }
 )

 const queryClient = useQueryClient()

 let content;

 if (isLoading) {
    content = 'Loading...'
 }

 if (isError) {
    content = `Error occured. ${error}`
 }

 if (data) {
    content = <div>
         <Link to={`/jobs/create`}>Create Job</Link>
        <ul>
            {data.map((job: TJob) => {
                return <li key={job.id}>
                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    <button>
                        <Link to={`/jobs/${job.id}/edit`}>
                            Edit
                        </Link>
                    </button>
                    <button onClick={() => handleDeleteJob(job.id)}>Delete</button>
                </li>
            })}
        </ul>
    </div>
 }



 const handleDeleteJob = (id: number | undefined) => {
  deleteMutation.mutate(id)
 }

 const deleteMutation = useMutation({
    mutationFn: (id: number | undefined) => deleteJob(id),
    onSuccess: (data) => {
        console.log(data.message);
        queryClient.invalidateQueries({ queryKey: ['jobs'] })
    }
 })



  return (
    <div>
        {content}
    </div>
  )
}

// export default JobList