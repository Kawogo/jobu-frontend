import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import { deleteJobRequirement, editJob, fetchJob } from "../../api/job";
import { TJobError, type TJob } from "./types/jobTypes";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditJob = () => {
  const [inputs, setInputs] = useState<string[]>([]);
  const [reqs, setReqs] = useState<{ id?: number,  name: string }[]>([]);
  const navigate = useNavigate()
  const {id: jobId} = useParams()
  const {data, isError, error, isLoading} = useQuery(
    {
        queryKey: ['job-edit', jobId],
        queryFn: () => fetchJob(jobId)
    }
 )
 const [responseErrors, setResponseErrors] = useState<TJobError>()

 const queryClient = useQueryClient()


  const titleRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };

  const handleReqs = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    e.preventDefault();

    const { value } = e.target;
    const updatedReqs = [...reqs];
    updatedReqs[i] = { ...updatedReqs[i], name: value };
    setReqs(updatedReqs);

    console.log(reqs);
    

  };


  const editPostMutation = useMutation({
    mutationFn: (job: TJob) => editJob(job,jobId),
    onSuccess: () => {
      navigate('/jobs')
    },
    onError: (error) => {

      if (axios.isAxiosError(error) && error.response) {
        setResponseErrors(error.response.data.errors)
      }

    },
  })



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalJob = {
      title: titleRef.current?.value || "",
      location: locationRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      requirements: reqs,
    };


    console.log('FINAL JOB', finalJob);
    

    editPostMutation.mutate(finalJob)

  };

  
  const deleteReqMutation = useMutation({
      mutationFn: (reqId: number | undefined) => deleteJobRequirement(jobId, reqId),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['job-edit', jobId] })
          console.log('REQS AFTER DEL: ', reqs);  
      }
   })
   

  const handleDeleteReq = (id: number | undefined) => {
    deleteReqMutation.mutate(id)
  }

  const handleRemoveReq = (i: number) => {
    setReqs(reqs.filter((_, index) => i !== index))
    setInputs(inputs.filter((_, index) => i !== index))
  }



  let content;

  if (isLoading) {
     content = 'Loading...'
  }
 
  if (isError) {
     content = `Error occured. ${error}`
  }


  useEffect(() => {

    if (data) {
      let temp = data?.requirements.map((reqm) => ({id: reqm.id ,name: reqm.name}))
      setReqs(temp ?? [])  
    }
  
  }, [data])
  

  


  if (data) {
    
    content = <form onSubmit={handleSubmit}>
                Title: <input type="text" ref={titleRef} defaultValue={data?.title}/>
                <span>
                {responseErrors && responseErrors?.title && responseErrors?.title[0]}          
                </span>
                <br /><br />
                Location: <input type="text" ref={locationRef} defaultValue={data?.location} />
                <span>
                {responseErrors && responseErrors?.location && responseErrors?.location[0]}          
                </span>
                <br /><br />
                Description: <textarea ref={descriptionRef} cols={30} rows={10} defaultValue={data?.description}></textarea>
                <span>
                {responseErrors && responseErrors?.description && responseErrors?.description[0]}          
                </span>
                <br /><br />
                <h1>Requirements</h1>
                <span>{responseErrors && responseErrors?.requirements && responseErrors?.requirements[0]}</span>
                <div>
                  {data?.requirements.map((req, i) => (
                    <div key={i}>
                      <input type="text" onChange={(e) => handleReqs(e, i)} defaultValue={req?.name} />
                      <button onClick={() => handleDeleteReq(req.id)} type="button">Delete</button>
                    </div>
                  ))}
                  {inputs.map((_, i) => (
                    <div key={i}>
                      <input type="text" onChange={(e) => handleReqs(e, i + data?.requirements.length)} />
                      <button onClick={() => handleRemoveReq(i + data?.requirements.length)} type="button">Delete</button>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddInput}>Add requirement</button>
                </div>
                <button type="submit">Submit</button>
              </form>
  }

  return (
    <>
      {content}
    </>
  );
};

export default EditJob;
