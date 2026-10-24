import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/aishe/colleges';

const AisheCollegeStatistics = () => {
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStatistics = async (state = '') => {
    try {
      setLoading(true);
      setError('');

      const url = state
        ? `${API_URL}?state=${encodeURIComponent(state)}`
        : API_URL;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch AISHE data');
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.message || 'Failed to load data');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load AISHE college statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    fetchStatistics(state);
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return Number(value).toLocaleString('en-IN');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            AISHE College Statistics
          </h1>

          <p className="mt-2 text-gray-600">
            State-wise higher education statistics from AISHE 2023-24.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 rounded-lg bg-white p-5 shadow">
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select State / Union Territory
          </label>

          <select
            id="state"
            value={selectedState}
            onChange={handleStateChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none md:w-96"
          >
            <option value="">All States / Union Territories</option>

            {[
              ...new Set(
                data
                  .map((item) => item.state_name)
                  .filter(Boolean)
              ),
            ].map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-gray-600">
              Loading AISHE statistics...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        {!loading && !error && data.length > 0 && (
          <>
            {/* Summary cards */}
            <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-lg bg-white p-5 shadow">
                <p className="text-sm text-gray-500">
                  States / UTs
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {data.length}
                </p>
              </div>

              <div className="rounded-lg bg-white p-5 shadow">
                <p className="text-sm text-gray-500">
                  Total Colleges
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {formatNumber(
                    data.reduce(
                      (sum, item) =>
                        sum + Number(item.number_of_colleges || 0),
                      0
                    )
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-white p-5 shadow">
                <p className="text-sm text-gray-500">
                  Colleges Responded
                </p>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {formatNumber(
                    data.reduce(
                      (sum, item) =>
                        sum + Number(item.colleges_responded || 0),
                      0
                    )
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-white p-5 shadow">
                <p className="text-sm text-gray-500">
                  Academic Year
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-600">
                  {data[0]?.academic_year || '2023-24'}
                </p>
              </div>

            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full">

                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        State / UT
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Districts with Colleges
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Number of Colleges
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Colleges Responded
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Colleges / Lakh Population
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Average Enrolment
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">

                    {data.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {item.state_name}
                        </td>

                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          {formatNumber(item.districts_with_colleges)}
                        </td>

                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          {formatNumber(item.number_of_colleges)}
                        </td>

                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          {formatNumber(item.colleges_responded)}
                        </td>

                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          {item.colleges_per_lakh_population || '-'}
                        </td>

                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          {item.average_enrolment || '-'}
                        </td>

                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>

            {/* Source */}
            <div className="mt-5 text-sm text-gray-500">
              <p>
                Source: All India Survey on Higher Education (AISHE),
                Academic Year 2023-24.
              </p>
            </div>
          </>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-gray-600">
              No statistics found for the selected state.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AisheCollegeStatistics;