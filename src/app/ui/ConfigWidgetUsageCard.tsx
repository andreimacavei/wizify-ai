'use client';
import React, { useContext, useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { KeyContext } from '@/app/context';
import 'react-circular-progressbar/dist/styles.css';

const fetchWidgetData = async (userId) => {
  const response = await fetch(`/api/widget?userId=${userId}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
};

const updateOption = async (widgetId, optionId, isEnabled, description, prompt) => {
  const response = await fetch(`/api/widget`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ widgetId, optionId, isEnabled, description, prompt }),
  });
  const data = await response.json();
  return data;
};

const deleteCustomOption = async (widgetId, optionId) => {
  console.log("Trying to delete option " + optionId + " from widget " + widgetId);
  const response = await fetch(`/api/widget`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ widgetId, optionId }),
  });
  const data = await response.json();
  return data;
};

const addCustomAction = async (widgetId, name, description, prompt, actionParentId) => {
  const response = await fetch(`/api/widget`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ widgetId, name, description, prompt, actionParentId }),
  });
  const data = await response.json();
  return data;
};

const flattenOptions = (options) => {
  return options.reduce((acc, option) => {
    acc.push(option);
    if (option.children) {
      acc = acc.concat(flattenOptions(option.children));
    }
    return acc;
  }, []);
};


export default function UsageCard({ userId }) {
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState({});
  const { keys, setKeys } = useContext(KeyContext);
  const [widgetData, setWidgetData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [newAction, setNewAction] = useState({ name: '', description: '', prompt: '', actionParentId: null });
  const [customOptionsEdits, setCustomOptionsEdits] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error('User ID is not provided');
        setError('User ID is required');
        setLoading(false);
        return;
      }

      console.log('User ID used for fetching data: ', userId);
      try {
        const data = await fetchWidgetData(userId);
        if (data.error) {
          setError(data.error);
        } else {
          setWidgetData(data);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching widget data:', err);
      }
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleOptionChange = (optionId, field, value) => {
    setCustomOptionsEdits((prev) => ({
      ...prev,
      [optionId]: { ...prev[optionId], [field]: value },
    }));
  };


  const saveOptionChanges = async (optionId) => {
    const optionEdits = customOptionsEdits[optionId] || {};
    
    // Flatten the customOptions array
    const flattenedCustomOptions = flattenOptions(widgetData.customOptions);
    const originalOption = flattenedCustomOptions.find(option => option.id === optionId);
  
    if (!originalOption) {
      console.error(`Original option with ID ${optionId} not found`);
      setError('Original option not found');
      return;
    }
  
    const isEnabled = optionEdits.isEnabled !== undefined ? optionEdits.isEnabled : originalOption.isEnabled;
    const description = optionEdits.description !== undefined ? optionEdits.description : originalOption.description;
    const prompt = optionEdits.prompt !== undefined ? optionEdits.prompt : originalOption.prompt;
  
    setLoadingOptions((prev) => ({ ...prev, [optionId]: true }));
    try {
      const response = await updateOption(widgetData.widgetId, optionId, isEnabled, description, prompt);
      if (!response.success) {
        setError(response.error);
      } else {
        setWidgetData((prevData) => {
          const updateOptions = (options) =>
            options.map((option) =>
              option.id === optionId ? { ...option, ...optionEdits, isEnabled, description, prompt } : option
            );
          return {
            ...prevData,
            customOptions: updateOptions(prevData.customOptions),
          };
        });
        if (response.promptChanged) {
          setSuccessMessage('Your custom action will be live once it will be reviewed and approved');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred while updating the option');
      console.error('Error updating option:', err);
    } finally {
      setLoadingOptions((prev) => ({ ...prev, [optionId]: false }));
    }
  };
  
  

  const handleDeleteOption = async (optionId) => {
    setLoadingOptions((prev) => ({ ...prev, [optionId]: true }));
    console.log("Trying to delete option " + optionId + " from widget " + widgetData.widgetId);

    try {
      const response = await deleteCustomOption(widgetData.widgetId, optionId);
      if (!response.success) {
        setError(response.error);
      } else {
        setWidgetData((prevData) => {
          const updateOptions = (options) => options.filter((option) => option.id !== optionId);
          return {
            ...prevData,
            customOptions: updateOptions(prevData.customOptions),
          };
        });
      }
    } catch (err) {
      setError('An unexpected error occurred while deleting the option');
      console.error('Error deleting option:', err);
    } finally {
      setLoadingOptions((prev) => ({ ...prev, [optionId]: false }));
    }
  };

  const handleAddCustomAction = async (event) => {
    event.preventDefault();
    const { name, description, prompt, actionParentId } = newAction;

    if (!name || !description || !prompt) {
      setError('All fields are required');
      return;
    }

    let actionParentIdAsInt = null;
    if (actionParentId != null) {
      actionParentIdAsInt = parseInt(actionParentId, 10);
    }

    try {
      const response = await addCustomAction(widgetData.widgetId, name, description, prompt, actionParentIdAsInt);
      if (!response.success) {
        setError(response.error);
      } else {
        setWidgetData((prevData) => ({
          ...prevData,
          customOptions: [...prevData.customOptions, response.action],
        }));
        setNewAction({ name: '', description: '', prompt: '', actionParentId: null });
        setSuccessMessage('Your custom action will be live once it will be reviewed and approved');
      }
    } catch (err) {
      setError('An unexpected error occurred while adding the custom action');
      console.error('Error adding custom action:', err);
    }
  };

  const getParentName = (parentId) => {
    if (!parentId) return 'N/A';
    const parent = [...widgetData.planOptions, ...widgetData.customOptions].find(option => option.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  const renderOptions = (options, isCustom, depth = 0) => {
    return options.map(option => (
      <React.Fragment key={option.id}>
        <tr>
          <td className="border px-4 py-2" style={{ paddingLeft: `${depth * 20}px` }}>
            {isCustom ? (
              <input
                type="text"
                value={customOptionsEdits[option.id]?.name ?? option.name}
                onChange={(e) => handleOptionChange(option.id, 'name', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            ) : (
              option.name
            )}
          </td>
          <td className="border px-4 py-2">
            {isCustom ? (
              <input
                type="text"
                value={customOptionsEdits[option.id]?.description ?? option.description}
                onChange={(e) => handleOptionChange(option.id, 'description', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            ) : (
              option.description
            )}
          </td>
          <td className="border px-4 py-2">
            {isCustom ? (
              <input
                type="text"
                value={customOptionsEdits[option.id]?.prompt ?? option.prompt}
                onChange={(e) => handleOptionChange(option.id, 'prompt', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            ) : (
              option.prompt
            )}
          </td>
          <td className="border px-4 py-2">{getParentName(option.actionParentId)}</td>
          <td className="border px-4 py-2">
            <input
              type="checkbox"
              checked={customOptionsEdits[option.id]?.isEnabled ?? option.isEnabled}
              onChange={(e) => handleOptionChange(option.id, 'isEnabled', e.target.checked)}
              className="ml-2"
              disabled={!isCustom}
            />
          </td>
          {isCustom && (
            <>
              <td className="border px-4 py-2">
                <button
                  onClick={() => saveOptionChanges(option.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loadingOptions[option.id]}
                >
                  {loadingOptions[option.id] ? "Saving..." : "Save"}
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteOption(option.id)}
                  className="bg-red-500 hover:bg-red-700 text-red font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loadingOptions[option.id]}
                >
                  {loadingOptions[option.id] ? "Processing..." : "Delete"}
                </button>
              </td>
            </>
          )}
        </tr>
        {option.children && renderOptions(option.children, isCustom, depth + 1)}
      </React.Fragment>
    ));
  };
  
  return (
    <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5">
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-bold mb-6">Fetch Widget Options</h1>

        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        {widgetData && (
          <>
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <h2 className="text-3xl font-bold mb-6">Widget Data</h2>
              <p><strong>User ID:</strong> {widgetData.userId}</p>
              <p><strong>Subscription ID:</strong> {widgetData.subscriptionId || 'N/A'}</p>
              <p><strong>Plan Name:</strong> {widgetData.planName || 'N/A'}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <h3 className="text-2xl font-bold mb-4">Plan Options</h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Description</th>
                    <th className="py-2">Prompt</th>
                    <th className="py-2">Parent</th>
                    <th className="py-2">Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {renderOptions(widgetData.planOptions, false)}
                </tbody>
              </table>
            </div>

            {widgetData.planName === 'Free' ? (
              <>
                <div className="relative bg-white p-8 rounded-lg shadow-lg mb-8">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center" style={{ zIndex: 10, pointerEvents: 'none' }}>
                    <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.25rem', opacity: 1, pointerEvents: 'all' }}>
                      <a href="/dashboard/subscription" style={{ textDecoration: 'underline' }}>Upgrade</a> your subscription to unlock this feature
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Custom Options</h3>
                  <table className="min-w-full bg-white opacity-30">
                    <thead>
                      <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Prompt</th>
                        <th className="py-2">Parent</th>
                        <th className="py-2">Enabled</th>
                        <th className="py-2">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">Mock Name</td>
                        <td className="border px-4 py-2">Mock Description</td>
                        <td className="border px-4 py-2">Mock Prompt</td>
                        <td className="border px-4 py-2">N/A</td>
                        <td className="border px-4 py-2">
                          <input type="checkbox" disabled className="ml-2" />
                        </td>
                        <td className="border px-4 py-2">
                          <button className="bg-red-500 text-red font-bold py-2 px-4 rounded" disabled>
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="relative bg-white p-8 rounded-lg shadow-lg mb-8">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center" style={{ zIndex: 10, pointerEvents: 'none' }}>
                    <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.25rem', opacity: 1, pointerEvents: 'all' }}>
                      <a href="/dashboard/subscription" style={{ textDecoration: 'underline' }}>Upgrade</a> your subscription to unlock this feature
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Add Custom Action</h3>
                  <form>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Name:</label>
                      <input
                        type="text"
                        value="Mock Name"
                        disabled
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Description:</label>
                      <input
                        type="text"
                        value="Mock Description"
                        disabled
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Prompt:</label>
                      <input
                        type="text"
                        value="Mock Prompt"
                        disabled
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Parent:</label>
                      <select
                        value=""
                        disabled
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">None</option>
                      </select>
                    </div>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline" disabled>
                      Add Action
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4">Custom Options</h3>
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Prompt</th>
                        <th className="py-2">Parent</th>
                        <th className="py-2">Enabled</th>
                        <th className="py-2">Save</th>
                        <th className="py-2">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderOptions(widgetData.customOptions, true)}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4">Add Custom Action</h3>
                  <form onSubmit={handleAddCustomAction}>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Name:</label>
                      <input
                        type="text"
                        value={newAction.name}
                        onChange={(e) => setNewAction({ ...newAction, name: e.target.value })}
                        required
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Description:</label>
                      <input
                        type="text"
                        value={newAction.description}
                        onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                        required
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Prompt:</label>
                      <input
                        type="text"
                        value={newAction.prompt}
                        onChange={(e) => setNewAction({ ...newAction, prompt: e.target.value })}
                        required
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Parent:</label>
                      <select
                        value={newAction.actionParentId || ''}
                        onChange={(e) => setNewAction({ ...newAction, actionParentId: e.target.value || null })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">None</option>
                        {widgetData.customOptions.map((option) => (
                          <option hidden={option.actionParentId != null} key={option.id} value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline">
                      Add Action
                    </button>
                  </form>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
