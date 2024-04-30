'use client';
import * as Dialog from "@radix-ui/react-dialog";
import { registerApiKey } from "@/app/lib/actions";
import { useContext, useState } from "react";
import { KeyContext } from "@/app/context";

function NewKeyDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const { keys, setKeys } = useContext(KeyContext);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    let formData = new FormData(e.target as HTMLFormElement)
    // let result = await registerNewDomain(formData)
    let result = await registerApiKey(formData)
    console.log("register new key: ", result)
    setLoading(false)
    if (result.status === 'success') {
      setSuccess(true)
      setStatusMsg(result.msg)
      // update apiKeys context
      setKeys((prev: any) => [...prev, result.data])
      setOpen(false)
    }
    else {
      setSuccess(false)
      setStatusMsg(result.msg)
    }
  }

  return (
  <Dialog.Root open={open} onOpenChange={setOpen}>
			
      <Dialog.Trigger asChild>
      <button className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Add new key
      </button>
      </Dialog.Trigger>
			<Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className="animate-fade-in fixed inset-0 z-40 bg-gray bg-opacity-50 backdrop-blur-md"
				/>
				<Dialog.Content 
          className="animate-scale-in fixed inset-0 z-40 m-auto max-h-fit w-full max-w-lg overflow-hidden border border-gray bg-white shadow-xl sm:rounded-xl p-8"
        >
          <Dialog.Title className="DialogTitle">
            <p className="text-xl text-blue-500 border-b border-blue-500 pb-2 my-4">
            Add a new Open AI API Key
            </p>
            
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
          <label className="text-slate-600 text-xm">
              You can add your own  <span className='text-blue-500'>Open AI API Key</span> and reduce
              the costs of using our service.
          </label>
          </Dialog.Description>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						
						<div className='flex gap-4 items-center'>
							<input id="apikey" name="apikey" type="text" minLength={50} maxLength={100} required
								placeholder='Example: sk-...zcfg'
                className="grow border border-slate-300 rounded px-2 py-1 outline-none text-slate-800"
              ></input>
            </div>
            <div className='flex gap-4 items-center'>
							<input id="description" name="description" type="text" maxLength={30}
								placeholder='Description/tag for this key'
                className="grow border border-slate-300 rounded px-2 py-1 outline-none text-slate-800"
              ></input>
						</div>
            <div className='flex justify-end gap-2'>
              <Dialog.Close className='border border-gray-300 rounded px-2 py-1 hover:bg-gray focus-within:bg-gray-200 active:scale-95 transition-all duration-75'>Cancel</Dialog.Close>
							<button type="submit" disabled={loading}
								className="border text-blue-500 border-blue-500 rounded px-2 py-1 hover:bg-blue-500 hover:bg-opacity-20 focus-within:bg-opacity-20 enabled:active:scale-95 transition-all duration-75 disabled:cursor-default">
                Add
              </button>
							
						</div>
						{loading && <p className='mt-4 text-green-500 text-center'>Loading...</p>}
						<p className={`mt-4 ${success? "text-green-500": "text-red"} text-center`}>{statusMsg } </p>
							{/* {error && <p className='mt-4  text-center'>Something went wrong. Please try again.</p>} */}
					</form>
				</Dialog.Content>
			</Dialog.Portal>
    </Dialog.Root>
  )
}

export default NewKeyDialog;