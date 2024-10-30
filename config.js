// Appwrite configuration
const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '67220834003478021f9c',
    databaseId: 'daycare_registrations',
    registrationCollectionId: 'registrations'
};

// Initialize Appwrite Client
const client = new Client();

// Set up the client
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

// Initialize Appwrite services
const databases = new Databases(client);
const account = new Account(client);

// Export everything
export { client, databases, account, appwriteConfig }; 