import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getSecretValue, getCertificateBase64 } from "./keyVaultHelper";
import { generateTokenWithCertificate } from "./tokenHelper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const secretName = req.query.secretName || (req.body && req.body.secretName);
    const certName = req.query.certName || (req.body && req.body.certName);
    
    if (!secretName && !certName) {
        context.res = {
            status: 400,
            body: "Please provide either a secretName or certName"
        };
        return;
    }

    try {
        if (secretName) {
            const secretValue = await getSecretValue(secretName);
            context.res = {
                status: 200,
                body: `Secret Value: ${secretValue}`
            };
        } else if (certName) {
            const certBase64 = await getCertificateBase64(certName);
            const token = await generateTokenWithCertificate(certBase64, "your-audience-url");
            context.res = {
                status: 200,
                body: `Generated Token: ${token}`
            };
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    }
};

export default httpTrigger;
