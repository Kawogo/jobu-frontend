import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { fetchJob } from "../../api/job";


const Job = () => {

  const {id} = useParams()
  const {data: job, isError, error, isLoading} = useQuery(
    {
        queryKey: ['job', id],
        queryFn: () => fetchJob(id)
    }
 )

 let content;

 if (isLoading) {
    content = 'Loading...'
 }

 if (isError) {
    content = `Error occured. ${error}`
 }

 if (job) {
  content = <div>
    <h1>Title: {job.title}</h1>
    <h3>Location: {job.location}</h3>
    <p>{job.description}</p>
    <hr />
    <h2>REQUIREMENTS</h2>
    <ul>
      {job.requirements.map((req) => <li key={req?.id}>{req?.name}</li>)}
    </ul>
  </div>
 }


  return (
    <div>
      {content}
    </div>
  )
}

export default Job