document.addEventListener('DOMContentLoaded', () => {
    // Sample Arduino code data
    const arduinoCodes = [
        {
            id: 1,
            title: "Blink LED",
            description: "Basic example to blink an LED connected to digital pin 13",
            code: `
void setup() {
    pinMode(13, OUTPUT);    // Set pin 13 as output
}

void loop() {
    digitalWrite(13, HIGH); // Turn LED on
    delay(1000);           // Wait for 1 second
    digitalWrite(13, LOW);  // Turn LED off
    delay(1000);           // Wait for 1 second
}`
        },
        {
            id: 2,
            title: "Serial Communication",
            description: "Read data from Serial port and echo it back",
            code: `
void setup() {
    Serial.begin(9600);    // Initialize serial communication
}

void loop() {
    if (Serial.available() > 0) {
        char data = Serial.read();  // Read incoming data
        Serial.print(data);         // Echo it back
    }
}`
        },
        {
            id: 3,
            title: "DHT11 Temperature Sensor",
            description: "Read temperature and humidity from DHT11 sensor",
            code: `
#include <DHT.h>

#define DHTPIN 2       // DHT11 data pin
#define DHTTYPE DHT11  // DHT11 sensor type

DHT dht(DHTPIN, DHTTYPE);

void setup() {
    Serial.begin(9600);
    dht.begin();
}

void loop() {
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h) || isnan(t)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
    }

    Serial.print("Humidity: ");
    Serial.print(h);
    Serial.print("%  Temperature: ");
    Serial.print(t);
    Serial.println("°C");
    
    delay(2000);
}`
        },
        {
            id: 4,
            title: "Servo Motor Control",
            description: "Control a servo motor using the Servo library",
            code: `
#include <Servo.h>

Servo myservo;  // Create servo object
int pos = 0;    // Variable to store position

void setup() {
    myservo.attach(9);  // Attaches servo on pin 9
}

void loop() {
    // Rotate from 0 to 180 degrees
    for (pos = 0; pos <= 180; pos++) {
        myservo.write(pos);
        delay(15);
    }
    
    // Rotate from 180 to 0 degrees
    for (pos = 180; pos >= 0; pos--) {
        myservo.write(pos);
        delay(15);
    }
}`
        },
        {
            id: 5,
            title: "Ultrasonic Distance Sensor",
            description: "Measure distance using HC-SR04 ultrasonic sensor",
            code: `
#define TRIG_PIN 9
#define ECHO_PIN 10

void setup() {
    Serial.begin(9600);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
}

void loop() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    
    long duration = pulseIn(ECHO_PIN, HIGH);
    float distance = duration * 0.034 / 2;
    
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
    
    delay(1000);
}`
        }
    ];

    const codeContainer = document.getElementById('code-container');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('codeModal');
    const modalTitle = document.getElementById('modalTitle');
    const codeContent = document.getElementById('codeContent');
    const closeModal = document.getElementById('closeModal');
    const copyCode = document.getElementById('copyCode');

    // Function to create code cards
    function createCodeCard(code) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6';
        card.innerHTML = `
            <h3 class="text-xl font-semibold text-gray-800 mb-2">${code.title}</h3>
            <p class="text-gray-600 mb-4">${code.description}</p>
            <button class="view-code-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                <i class="fas fa-code mr-2"></i>View Code
            </button>
        `;

        card.querySelector('.view-code-btn').addEventListener('click', () => {
            showModal(code);
        });

        return card;
    }

    // Function to show modal with code
    function showModal(code) {
        modalTitle.textContent = code.title;
        codeContent.textContent = code.code.trim();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        hljs.highlightElement(codeContent);
    }

    // Function to filter codes
    function filterCodes(searchTerm) {
        const term = searchTerm.toLowerCase();
        return arduinoCodes.filter(code => 
            code.title.toLowerCase().includes(term) || 
            code.description.toLowerCase().includes(term)
        );
    }

    // Function to render code cards
    function renderCodes(codes) {
        codeContainer.innerHTML = '';
        if (codes.length === 0) {
            codeContainer.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">No code examples found matching your search.</p>
                </div>
            `;
            return;
        }
        codes.forEach(code => {
            codeContainer.appendChild(createCodeCard(code));
        });
    }

    // Initial render
    renderCodes(arduinoCodes);

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        const filteredCodes = filterCodes(e.target.value);
        renderCodes(filteredCodes);
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    copyCode.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(codeContent.textContent);
            copyCode.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
            setTimeout(() => {
                copyCode.innerHTML = '<i class="fas fa-copy mr-2"></i>Copy Code';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
});
