import React, { useState } from 'react';
import TripForm from './TripForm';
import ActivitySelector from './ActivitySelector';
import ItineraryGenerator from './ItineraryGenerator';
import ItineraryEditor from './ItineraryEditor';

const TripPlanner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [tripId, setTripId] = useState(null);

  const steps = [
    { number: 1, title: 'Trip Details' },
    { number: 2, title: 'Select Activities' },
    { number: 3, title: 'Generate Schedule' },
    { number: 4, title: 'Customize & Share' }
  ];

  const handleTripCreated = (data, id) => {
    setTripData(data);
    setTripId(id);
    setSelectedActivities([]); // Reset selected activities
    setCurrentStep(2);
  };

  const handleActivitiesSelected = (activities) => {
    setSelectedActivities(activities);
    setCurrentStep(3);
  };

  const handleItineraryGenerated = (generatedItinerary) => {
    setItinerary(generatedItinerary);
    setCurrentStep(4);
  };

  const handleItineraryUpdated = (updatedItinerary) => {
    setItinerary(updatedItinerary);
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div>
      {/* Progress Steps */}
      <div className="steps">
        {steps.map(step => (
          <div 
            key={step.number}
            className={`step ${currentStep >= step.number ? 'active' : ''}`}
            onClick={() => handleStepClick(step.number)}
            style={{ cursor: currentStep >= step.number ? 'pointer' : 'default' }}
          >
            <div className="step-number">{step.number}</div>
            <span>{step.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <TripForm onTripCreated={handleTripCreated} />
      )}

      {currentStep === 2 && tripData && (
        <ActivitySelector
          destination={tripData.destination}
          selectedActivities={selectedActivities}
          onActivitiesSelected={handleActivitiesSelected}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && tripData && selectedActivities.length > 0 && (
        <ItineraryGenerator
          tripId={tripId}
          tripData={tripData}
          selectedActivities={selectedActivities}
          onItineraryGenerated={handleItineraryGenerated}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && itinerary && (
        <ItineraryEditor
          tripId={tripId}
          tripData={tripData}
          itinerary={itinerary}
          onItineraryUpdated={handleItineraryUpdated}
          onBack={() => setCurrentStep(3)}
        />
      )}
    </div>
  );
};

export default TripPlanner;