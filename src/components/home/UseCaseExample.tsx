
interface UseCaseProps {
  name: string;
  content: string;
  inputType: string;
  style: object;
}

export default function UseCaseExample({useCase}: {useCase: UseCaseProps}) {
  return (
    // <li className="flex gap-1 items-center rounded-md border border-gray-200 bg-white p-3 shadow-lg">
      <li className="flex gap-1 items-center rounded-md border border-black bg-graydark px-5 py-2 text-sm  shadow-lg transition-al">
      <div className="flex-1 items-start flex flex-col gap-2 px-3 py-2">
        <div className="h-6 rounded-md font-bold text-white">{useCase.name}</div>
        {useCase.inputType === 'input' &&
          <input type="text" placeholder={useCase.content}
            defaultValue={useCase.content}
            className="rounded-md border border-gray-200 p-2 text-dark font-bold"
            style={useCase.style}
          />
        }
        {useCase.inputType === 'textarea' &&
          <textarea placeholder={useCase.content}
            defaultValue={useCase.content}
            className="rounded-md border border-gray-200 p-2 font-bold resize-none"
            style={useCase.style}
          />
        }
      </div>
    </li>
  )
}
