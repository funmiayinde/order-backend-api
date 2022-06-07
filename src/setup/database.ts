import admin, {initializeApp, firestore} from 'firebase-admin';
import config from 'config';

const privateKey = `${config.get('database.firebase.private_key')}`.replace(/\\n/g, '\n');

export const firebaseConfig = {
    apiKey: config.get('database.firebase.api_key'),
    authDomain: config.get('database.firebase.auth_domain'),
    databaseURL: config.get('database.firebase.database_url') as string,
    projectId: config.get('database.firebase.project_id') as string,
    storageBucket: config.get('database.firebase.storage_bucket'),
    messagingSenderId: config.get('database.firebase.messaging_sender_id'),
    appId: config.get('database.firebase.app_id'),  
    clientEmail: config.get('database.firebase.client_email') as string,  
    privateKey,
};

export const firebase = initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: firebaseConfig.databaseURL,
});

export const db = firestore();