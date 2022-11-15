import { env } from '../data-source';
import { updateUser } from '../service/user_service';
import { queueJob, createRegisterer } from './general'

const sendgrid = require('@sendgrid/mail')
const handlerName = 'password_reset_email';
const fromEmail = env('SENDER_EMAIL')
const sendgridToken =env('SENDGRID_API_KEY') 

sendgrid.setApiKey(sendgridToken)

export type JobPayload = {
  userId: number
}

function generateRandomString (length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const processQueuedJob = async (job: JobPayload) => {

  try {
    const result = await updateUser(job.userId, {
      password: generateRandomString(8)
    });
    if (result.success && fromEmail && sendgridToken) {
      const url = `${env('APP_URL')}#/forgot-login?_t=${result.user.token}`
      const _response = await sendgrid.send({
        to: result.user.email,
        from:  fromEmail,
        subject: 'MansarTip Password reset',
        html: `
        Hello ${result.user.username},
        <p>
          You requested a password reset. Please click the link below in order to complete the process.
        </p>
        <p>
          <a href="${url}" _target="blank">Click Here</a> or copy and paste the this link <br/> <br/>
          ${url}
        </p>
        <p>
          Regards,<br/>
          J-man
        </p>
        `
      })
    }
  } catch (e) {
    console.log('could not send email: ' + e.message)
  }

  return true;
}

export const addToQueue = (userId: number) => {
  queueJob({ handler: handlerName, data: { userId } });
}

export default createRegisterer(handlerName, processQueuedJob);