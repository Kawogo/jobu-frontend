import { Link } from "react-router-dom"
import { type TJob } from "../types/jobTypes"



const JobItem = ({job}: {job: TJob}) => {
  return (
    <li>
        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
        <button>Edit</button>
        <button>Delete</button>
    </li>
  )
}

export default JobItem