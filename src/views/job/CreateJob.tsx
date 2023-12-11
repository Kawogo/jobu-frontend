import { useMutation } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
import { createJob } from "../../api/job";
import { TJobError, type TJob } from "./types/jobTypes";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateJob = () => {
  const [inputs, setInputs] = useState([""]);
  const [reqs, setReqs] = useState<{ name: string }[]>([]);
  const navigate = useNavigate()
  const [responseErrors, setResponseErrors] = useState<TJobError>()


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
    updatedReqs[i] = { name: value };
    setReqs(updatedReqs);

  };

  const handleRemoveReq = (i: number) => {
    setReqs(reqs.filter((_, index) => i !== index))
    setInputs(inputs.filter((_, index) => i !== index))
  }


  const createJobMutation = useMutation({
    mutationFn: (job: TJob) => createJob(job),
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

    createJobMutation.mutate(finalJob)

  };

  
  return (
    <>
      <form onSubmit={handleSubmit}>
        Title: <input type="text" ref={titleRef} />
        <span>
          {responseErrors && responseErrors?.title && responseErrors?.title[0]}          
        </span>
        <br /><br />
        Location: <input type="text" ref={locationRef} />
        <span>
          {responseErrors && responseErrors?.location && responseErrors?.location[0]}          
        </span>
        <br /><br />
        Description: <textarea ref={descriptionRef} cols={30} rows={10}></textarea>
        <span>
            {responseErrors && responseErrors?.description && responseErrors?.description[0]}          
        </span>
        <br /><br />
        <h1>Requirements</h1>
        <span>
            {responseErrors && responseErrors?.requirements && responseErrors?.requirements[0]}          
        </span>
        <div>
        {inputs.map((_, i) => (
            <div key={i}>
              <input type="text" onChange={(e) => handleReqs(e, i)} />
              <button onClick={() => handleRemoveReq(i)} type="button">Delete</button>
            </div>
          ))}
          <button type="button" onClick={handleAddInput}>Add requirement</button>
        </div>
        <button type="submit">Submit</button>
      </form>
      {/* <JobForm /> */}
    </>
  );
};

export default CreateJob;
