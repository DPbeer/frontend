const params = new URLSearchParams(window.location.search);
if (params.has('username') && params.has('token')) {
    const token = params.get('token');
    axios.get('http://localhost:3000/devices', {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        const devices = response.data;
        const deviceInfoElement = document.getElementById('deviceInfo');
        devices.forEach((device) => {
            const deviceNameElement = createElement('h2', `${device.name}: `);
            const deviceCommentElement = createElement('h5', device.comment);
            deviceInfoElement.appendChild(deviceNameElement);
            deviceInfoElement.appendChild(deviceCommentElement);
            const sensorDataElement = document.getElementById('sensorData');
            deviceNameElement.addEventListener('click', () => {
                toggleVisibility(deviceCommentElement);
                const sensorInfoElement = document.getElementById('sensorInfo');
                sensorInfoElement.innerHTML = '<h2>Мои Сенсоры</h2>';
                sensorDataElement.innerHTML = '';
                axios.get(`http://localhost:3000/devices/${device.id}/sensors`, { headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` } })
                    .then((sensorResponse) => {
                        const sensors = sensorResponse.data;
                        sensors.forEach((sensor) => {
                            const sensorNameElement = createElement('h2', `${sensor.name}: `);
                            const sensorCommentElement = createElement('h5', sensor.comment);
                            sensorInfoElement.appendChild(sensorNameElement);
                            sensorInfoElement.appendChild(sensorCommentElement);
                            sensorNameElement.addEventListener('click', () => {
                                toggleVisibility(sensorCommentElement);
                                const currentDate = new Date();
                                const endDate = new Date(currentDate.getTime() - (1 * 60 * 60 * 1000));
                                const formattedEndDate = endDate.toISOString();
                                axios.get(`http://localhost:3000/sensor/${sensor.id}/sensor-values`, {
                                    headers: {
                                        'content-type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                    params: {
                                        startDate: formattedEndDate,
                                        endDate: currentDate.toISOString(),
                                    },
                                }).then((sensorDataResponse) => {
                                    const sensorData = sensorDataResponse.data;
                                    const sensorDataContainer = document.createElement('div');
                                    sensorDataContainer.classList.add('sensorDataContainer');
                                    sensorData.forEach((data) => {
                                        const sensorDataEntry = document.createElement('p');
                                        const timestamp = new Date(data.timestamp);
                                        const formattedDate = `${timestamp.getDate()}.${timestamp.getMonth() + 1}.${timestamp.getFullYear()} ${timestamp.getHours()}:${timestamp.getMinutes()}`;
                                        const roundedValue = data.value.toFixed(3);
                                        sensorDataEntry.textContent = `Значение: ${roundedValue}, Дата и время: ${formattedDate}`;
                                        sensorDataContainer.appendChild(sensorDataEntry);
                                    });
                                    sensorDataElement.appendChild(sensorDataContainer);
                                });
                            });
                        });
                    });
            });
        });
    });
}

function createElement(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
}

function toggleVisibility(element) {
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}