import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import { createJob, editJob, fetchJob } from "../../../api/job";
import { type TJob } from "../types/jobTypes";
import { useNavigate, useParams } from "react-router-dom";

const JobForm = ({isEdit} : {isEdit?: boolean}) => {
  const [inputs, setInputs] = useState<string[]>([]);
  const [reqs, setReqs] = useState<{ name: string }[]>([]);
  const navigate = useNavigate()
  const {id} = useParams()


  const titleRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const reqRef = useRef<HTMLInputElement>(null);



    const {data, isError, error, isLoading} = useQuery(
        {
            queryKey: ['job-edit', id],
            queryFn: () => fetchJob(id)
        }
        )

    useEffect(() => {
    if (data && data.requirements) {
        let dataReq = [...data.requirements].map(item => ({ name: item.name }));
        setReqs(dataReq);
    }
    }, [data]);

  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };


  const handleReqs = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    e.preventDefault();

    const { value } = e.target;
    const updatedReqs = [...reqs];
    updatedReqs[i] = { name: value };
    setReqs(updatedReqs);

    console.log(reqs);
    

  };

  const mutation = useMutation({
    mutationFn: (job: TJob) => isEdit ? editJob(job,id) : createJob(job),
    onSuccess: () => {
      navigate('/jobs')
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalJob = {
      title: titleRef.current?.value || "",
      location: locationRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      requirements: reqs,
    };

    mutation.mutate(finalJob)

  };

  let content;

  if (isLoading) {
     content = 'Loading...'
  }
 
  if (isError) {
     content = `Error occured. ${error}`
  }



  return (
    <>
      {isEdit && content}


      <form onSubmit={handleSubmit}>
        Title: <input type="text" ref={titleRef} defaultValue={isEdit ? data?.title : ''} /><br /><br />
        Location: <input type="text" ref={locationRef} defaultValue={isEdit ? data?.location : ''}/><br /><br />
        Description: <textarea ref={descriptionRef} cols={30} rows={10} defaultValue={isEdit ? data?.description : ''}></textarea><br /><br />
        <h1>Requirements</h1>
        <div>
        {isEdit && data?.requirements.map((req, i) => (
            <div key={i}>
                <input type="text" ref={reqRef} defaultValue={req?.name} />
            </div>
        ))}

        {inputs.map((val, i) => (
            <div key={i}>
                <input type="text" onChange={(e) => handleReqs(e, i)} />
            </div>
        ))}
        <button type="button" onClick={() => handleAddInput()}>Add requirement</button>
        <br /><br />
        </div>
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </form>
    </>
  );
};

export default JobForm;
