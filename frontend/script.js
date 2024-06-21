document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/predict/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const universitySelect = document.getElementById('university');

        data.universities.forEach(university => {
            const option = document.createElement('option');
            option.value = university;
            option.textContent = university;
            universitySelect.appendChild(option);
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

document.getElementById('predictionForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const university = document.getElementById('university').value;
    const no_of_student = parseFloat(document.getElementById('no_of_student').value);
    const no_of_student_per_staff = parseFloat(document.getElementById('no_of_student_per_staff').value);
    const international_student = parseFloat(document.getElementById('international_student').value);
    const teaching_score = parseFloat(document.getElementById('teaching_score').value);
    const research_score = parseFloat(document.getElementById('research_score').value);
    const citations_score = parseFloat(document.getElementById('citations_score').value);
    const industry_income_score = parseFloat(document.getElementById('industry_income_score').value);
    const international_outlook_score = parseFloat(document.getElementById('international_outlook_score').value);
    const overall_score_min = parseFloat(document.getElementById('overall_score_min').value);
    const overall_score_max = parseFloat(document.getElementById('overall_score_max').value);
    const female_ratio = parseFloat(document.getElementById('female_ratio').value);
     
    const data = {
        "Name of University": university,
        "No of student": no_of_student,
        "No of student per staff": no_of_student_per_staff,
        "International Student": international_student,
        "Teaching Score": teaching_score,
        "Research Score": research_score,
        "Citations Score": citations_score,
        "Industry Income Score": industry_income_score,
        "International Outlook Score": international_outlook_score,
        "OverAll Score Min": overall_score_min,
        "OverAll Score Max": overall_score_max,
        "Female Ratio": female_ratio
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/predict/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        document.getElementById('result_model_1').innerText = 'Model Decision Tree Prediction: ' + result.prediction_model_1;
        document.getElementById('result_model_2').innerText = 'Model Random Forest Prediction: ' + result.prediction_model_2;
        document.getElementById('result_model_3').innerText = 'Model SVM Prediction: ' + result.prediction_model_3;

        // Highlight results for emphasis
        document.getElementById('result_model_1').classList.add('highlight');
        document.getElementById('result_model_2').classList.add('highlight');
        document.getElementById('result_model_3').classList.add('highlight');
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('result_model_1').innerText = 'Error: ' + error.message;
        document.getElementById('result_model_2').innerText = '';
        document.getElementById('result_model_3').innerText = '';
    }
});
