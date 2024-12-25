import React, { useState, useEffect } from 'react';

const UpdateLocalStorage = () => {
  const [keys, setKeys] = useState([]); // List of localStorage keys
  const [selectedKey, setSelectedKey] = useState(''); // Key to be updated
  const [currentValue, setCurrentValue] = useState(null); // Current value of the selected key
  const [editableFields, setEditableFields] = useState({}); // Editable fields for objects

  // Load keys from localStorage on component mount
  useEffect(() => {
    const storedKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      storedKeys.push(key);
    }
    setKeys(storedKeys);
  }, []);

  // Fetch current value whenever the selected key changes
  useEffect(() => {
    if (selectedKey) {
      const value = localStorage.getItem(selectedKey);
      try {
        const parsedValue = JSON.parse(value); // Try parsing the value
        setCurrentValue(parsedValue); // Store the object/array if valid JSON
        setEditableFields(parsedValue); // Initialize editable fields
      } catch {
        setCurrentValue(value); // Store the plain string if parsing fails
        setEditableFields({ value }); // Treat plain string as a single field
      }
    } else {
      setCurrentValue(null);
      setEditableFields({});
    }
  }, [selectedKey]);

  // Handle updating the value in localStorage
  const handleFieldChange = (field, newValue) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleUpdate = () => {
    if (selectedKey) {
      const updatedValue =
        typeof currentValue === 'object'
          ? JSON.stringify(editableFields) // Save updated object
          : editableFields.value; // Save updated string
      localStorage.setItem(selectedKey, updatedValue);
      alert(`Updated "${selectedKey}" successfully!`);
    } else {
      alert('Please select a key to update.');
    }
  };

  return (
    <div>
      <div>
        <label>
          Key :{' '}
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            <option value="">-- Select Key --</option>
            {keys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>
      {selectedKey && (
        <>
          <h4>Edit Current Value:</h4>
          <div
            style={{
              textAlign: 'right',
              display: 'flex',
              justifyContent: 'flex-start',
              width: '80%',
              flexDirection: 'column',
            }}
          >
            {typeof currentValue === 'object' ? (
              Object.entries(editableFields).map(([field, value]) => (
                <div key={field}>
                  <label>
                    {field} :{' '}
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                    />
                  </label>
                </div>
              ))
            ) : (
              <div>
                <label>
                  Value:
                  <input
                    type="text"
                    value={editableFields.value}
                    onChange={(e) => handleFieldChange('value', e.target.value)}
                  />
                </label>
              </div>
            )}
          </div>
        </>
      )}
      <button onClick={handleUpdate} disabled={!selectedKey}>
        Update
      </button>
    </div>
  );
};

export default UpdateLocalStorage;
