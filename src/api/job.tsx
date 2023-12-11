import http from "../libs/axios";
import { type TJob} from "../views/job/types/jobTypes";


type TId = number | undefined

export async function fetchAllJobs() {
    const {data} = await http.get('/jobs');
    return data.jobs
}

export async function fetchJob(id: string | undefined): Promise<TJob> {
    const {data} = await http.get(`/jobs/${id}`);
    return data.job
}


export async function createJob(job: TJob) {
    const {data} = await http.post('/jobs', job)
    return data
}


export async function editJob(job: TJob, id: string | undefined) {  
    const {data} = await http.put(`/jobs/${id}`, job)
    return data
}


export async function deleteJob(id: TId) {
    const {data} = await http.delete(`/jobs/${id}`);
    return data
}

//  delete job requirement
export async function deleteJobRequirement(jobId:  string | undefined, reqId: TId) {
    try {
        const {data} = await http.delete(`/jobs/${jobId}/requirements/${reqId}`);       
        return data 
    } catch (error) {
        console.log(error);  
    }    
}