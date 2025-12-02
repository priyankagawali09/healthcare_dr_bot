// Notification utility
// In production, integrate with SMS API like Twilio, MSG91, or Fast2SMS

export const sendSMS = async (phone, message) => {
  try {
    // For now, just log the message
    console.log('📱 SMS Notification:');
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log('---');
    
    // TODO: Integrate with SMS API
    // Example for MSG91:
    // await axios.post('https://api.msg91.com/api/v5/flow/', {
    //   authkey: process.env.MSG91_API_KEY,
    //   mobiles: phone,
    //   message: message
    // });
    
    return { success: true, message: 'Notification sent' };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
};

export const notifyOrderPlaced = async (userPhone, orderId, totalAmount) => {
  const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const message = `✅ Order Placed Successfully!\nOrder ID: ${orderId}\nAmount: ₹${totalAmount}\nTime: ${currentTime}\nThank you for ordering from Healthcare Dr. Bot!`;
  return await sendSMS(userPhone, message);
};

export const notifyOrderCancelled = async (userPhone, orderId) => {
  const message = `❌ Order Cancelled\nOrder ID: ${orderId}\nYour order has been cancelled successfully.`;
  return await sendSMS(userPhone, message);
};

export const notifyAppointmentBooked = async (userPhone, doctorName, date, time) => {
  const message = `🩺 Appointment Confirmed!\nDoctor: ${doctorName}\nDate: ${date}\nTime: ${time}\nPlease be on time.`;
  return await sendSMS(userPhone, message);
};

export const notifyDoctorAppointment = async (doctorPhone, patientName, date, time, symptoms) => {
  const message = `🩺 New Appointment!\nPatient: ${patientName}\nDate: ${date}\nTime: ${time}\nSymptoms: ${symptoms}`;
  return await sendSMS(doctorPhone, message);
};

export const notifyAppointmentCancelled = async (phone, appointmentId) => {
  const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const message = `❌ Appointment Cancelled\nAppointment ID: ${appointmentId}\nTime: ${currentTime}`;
  return await sendSMS(phone, message);
};

export const notifyAppointmentUpdated = async (phone, appointmentId, doctorName, date, time) => {
  const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const message = `🔄 Appointment Updated!\nAppointment ID: ${appointmentId}\nDoctor: ${doctorName}\nNew Date: ${date}\nNew Time: ${time}\nUpdated at: ${currentTime}`;
  return await sendSMS(phone, message);
};
