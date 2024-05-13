'use client';
import * as Dialog from "@radix-ui/react-dialog";
import { registerApiKey, updateKey, validateApiKey } from "@/app/lib/actions";
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

    let result = await registerApiKey(formData)
    console.log("register new key: ", result)
    setLoading(false)
    if (result.status === 'success') {
      setSuccess(true)
      setStatusMsg(result.msg)
      // update apiKeys context
      setKeys((prev: any) => [...prev, result.data])
      
      let res = await validateApiKey(result.data.key)
      if (res.status === 'success') {
        updateKey(result.data.key, { valid: true })
        setKeys((prev: any) => {
          let updatedKeys = prev.map((key: any) => {
            if (key.key === result.data.key) {
              key.valid = true
            }
            return key
          })
          return updatedKeys
        })
      } 
      setTimeout(() => {
        setStatusMsg(res.msg)
      }, 1000)

      setTimeout(() => {
        setOpen(false)
      }, 3000)
    }
    else {
      setSuccess(false)
      setStatusMsg(result.msg)
    }
  }

  const handleOnOpenChange = (open: boolean) => {
    setStatusMsg('')
    setOpen(open)
  }

  return (
  <Dialog.Root open={open} onOpenChange={handleOnOpenChange}>
			
      <Dialog.Trigger asChild>
      <button className="mt-4 rounded bg-orange px-4 py-2 font-bold text-white hover:bg-orangeDark">
        Add Key
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
            <p className="text-xl text-orange border-b border-orange pb-2 my-4">
            Add a new Open AI API Key
            </p>
            
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
          <label className="text-slate-600 text-xm">
              You can add your own  <span className='text-orange'>Open AI API Key</span> and reduce
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
              <Dialog.Close className='border border-gray-300 rounded px-2 py-1 hover:bg-gray focus-within:bg-gray-200 active:scale-95 transition-all duration-75'>
                Cancel
              </Dialog.Close>
							<button type="submit" disabled={loading}
								className="border text-orange border-orange rounded px-2 py-1 hover:bg-orange hover:bg-opacity-20 focus-within:bg-opacity-20 enabled:active:scale-95 transition-all duration-75 disabled:cursor-default">
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