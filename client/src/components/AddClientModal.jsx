import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useMutation } from '@apollo/client'

export default function AddClientModal() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

  return (
    <>
        {/* <!-- Button trigger modal --> */}
        <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addClientModal">
            <div className="d-flex align-items-center">
                <FaUser className="icon" />
                <div>Add Client</div>
            </div>
        </button>

        {/* <!-- Modal --> */}
        <div className="modal fade" id="addClientModal" tabIndex="-1" aria-labelledby="addClientModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="addClientModalLabel">Add Client</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" value={name} 
                            onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" value={email} 
                            onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input type="text" className="form-control" id="phone" value={phone} 
                            onChange={(e) => setPhone(e.target.value)} />
                        </div>
                    </form>
                </div>            
            </div>
        </div>
        </div>
    </>
  )
}
