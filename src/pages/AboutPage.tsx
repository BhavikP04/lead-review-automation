
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
            About Our Service
          </h1>
          <h2 className="text-2xl font-semibold text-indigo-600">
            What we do
          </h2>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            We help local businesses easily capture, manage, and follow up on their customer enquiries online. 
            This platform ensures no lead is missed, and timely follow-ups happen — even via WhatsApp.
          </p>
          
          <div className="flex justify-center mt-8">
            <img 
              src="https://img.freepik.com/free-vector/business-team-putting-together-jigsaw-puzzle-isolated-flat-vector-illustration-cartoon-partners-working-connection-teamwork-partnership-cooperation-concept_74855-9814.jpg" 
              alt="Team collaboration illustration"
              className="rounded-lg shadow-lg max-w-full h-auto md:max-w-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
