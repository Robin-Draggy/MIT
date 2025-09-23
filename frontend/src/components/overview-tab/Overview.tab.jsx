export const OverviewTab = ({ goToDataUpload }) => {
  return (
    <div className='text-gray-700'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white flex items-start gap-3 flex-col p-4 shadow-sm rounded-xl'>
          <div>
            <h2 className='text-xl font-semibold'>What is K-Anonymity?</h2>
            <p>
              K-anonymity is a privacy-preserving technique that ensures each
              individual in a dataset that is indistinguable from at leat k-1
              other individuals with respect to identifying attributes
              (quasi-identifiers)
            </p>
          </div>
          <h2 className='text-lg font-semibold'>Key Concepts:</h2>
          <ul className='list-disc px-6'>
            <li>
              <span className='font-bold'>Quasi-identifiers : </span>Attributes
              that can potentially identify individuals when combined (e.g. age,
              gender, zip code)
            </li>
            <li>
              <span className='font-bold'>Sensitive attributes : </span>Private
              information we wan to protect (e.g. medical diagnosis)
            </li>
            <li>
              <span className='font-bold'>Generalization : </span>Replace
              specific values with more general ones
            </li>
            <li>
              <span className='font-bold'>Suppression : </span>Remove records
              that cannot be adequately anonymized
            </li>
          </ul>
        </div>
        <div className='bg-white flex flex-col items-start gap-3 p-4 shadow-sm rounded-xl'>
          <h2 className='text-xl font-semibold'>Benefits & Limitations</h2>
          <div>
            <h2 className='text-lg font-semibold'>Benefits : </h2>
            <ul className='list-disc px-6'>
              <li>Protects individual privacy in shared datasets</li>
              <li>Prevents re-identification attacks</li>
              <li>Compiles with privacy regulations like GDPR</li>
              <li>Maintains data utility for analysis</li>
            </ul>
          </div>
          <div>
            <h2 className='text-lg font-semibold'>Limitaions : </h2>
            <ul className='list-disc px-6'>
              <li>May lead to significant information loss</li>
              <li>Valnerable to homogeneity attacks</li>
              <li>Does not protect against background knowledge attacks</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='w-full mt-3 p-4 bg-white shadow-sm rounded-xl'>
        <div className='flex flex-col items-start gap-3'>
          <div>
            <h2 className="text-xl font-bold">Get Started</h2>
            <p>Follow these steps to anonymize your dataset: </p>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex items-start gap-3'>
              <div className='bg-blue-800 rounded-full w-6 h-6 flex items-center justify-center'>
                <p className='text-white text-sm font-bold'>1</p>
              </div>

              <div className='flex flex-col'>
                <h2 className='font-bold text-lg'>Upload Data</h2>
                <p>Upload your CSV file or use our sample patient data</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='bg-blue-800 rounded-full w-6 h-6 flex items-center justify-center'>
                <p className='text-white text-sm font-bold'>2</p>
              </div>

              <div className='flex flex-col'>
                <h2 className='font-bold text-lg'>Configure Parameters</h2>
                <p>Set k-value, select quasi-identifiers and configure generalization levels</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='bg-blue-800 rounded-full w-6 h-6 flex items-center justify-center'>
                <p className='text-white text-sm font-bold'>3</p>
              </div>

              <div className='flex flex-col'>
                <h2 className='font-bold text-lg'>Review Results</h2>
                <p>Analyze anonymized data, metrics and export the results</p>
              </div>
            </div>
          </div>
          <div>
            <button onClick={goToDataUpload} className="px-3 py-1 cursor-pointer bg-blue-700 font-semibold text-white rounded-lg">Start Anonymization Process</button>
          </div>
        </div>
      </div>
    </div>
  );
};
