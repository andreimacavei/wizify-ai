'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function ConfigWidget(
) {
  
  const config = {
    items: [
      {
        name: 'Translate',
        action: 'translate',
      },
      {
        name: 'Change tone',
        action: 'change_tone',
        subitems: [
          {
            name: "Professional",
            tone: "professional",
          },
          {
            name: "Straightforward",
            tone: "straightforward",
          },
          {
            name: 'Friendly',
            tone: 'friendly'
          },
          {
            name: 'Confident',
            tone: 'formal'
          },
          {
            name: 'Casual',
            tone: 'casual'
          }
        ]
      },
      {
        name: 'Make shorter',
        action: 'make_shorter',
      },
      {
        name: 'Make longer',
        action: 'make_longer',
      },
      {
        name: 'Fix spelling',
        action: 'fix_spelling',
      },
      {
        name: 'Check tone',
        action: 'check_tone',
      }
    ]
  }

  const removeItem = (event) => {
    console.log(event.target);
    // config.items = config.items.filter(i => i.name !== item.name);
  }

  return (
    <div className="">
    <ul className="bg-white shadow overflow-hidden sm:rounded-md max-w-sm mx-auto mt-16">
    <li>
        <div className="px-4 py-2 sm:px-6 border-gray border-2 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Translate</h3>
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Edit</a>
          </div>
        </div>
    </li>
    <li>
        <div className="px-4 py-2 sm:px-6 border-gray border-2 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Change tone</h3>
              <button  onClick={removeItem} className="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
          </div>
        </div>
    </li>
    </ul>
    </div>
  );
}