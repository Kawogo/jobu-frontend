import './App.css'
import { Route, Routes } from 'react-router-dom'
import JobList from './views/job/JobList'
import Job from './views/job/Job'
import EditJob from './views/job/EditJob'
import CreateJob from './views/job/CreateJob'
import Login from './views/auth/Login'

function App() {

  return (
    <>
    <Routes>
      <Route path='/jobs' element={<JobList/>} />
      <Route path='/jobs/create' element={<CreateJob />} />
      <Route path='/jobs/:id' element={<Job/>} />
      <Route path='/jobs/:id/edit' element={<EditJob />} />
      <Route path='/login' element={<Login />} />
    </Routes>
    </>
  )
  
}

export default App
