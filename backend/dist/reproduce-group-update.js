"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permissions_1 = require("./src/auth/permissions");
async function main() {
    const loginUrl = 'http://localhost:3000/auth/login';
    const groupsUrl = 'http://localhost:3000/groups';
    try {
        console.log('Logging in...');
        const loginRes = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@minhaempresa.com', password: '123' }),
        });
    }
    catch (e) {
        console.error('Login failed', e);
    }
}
async function run() {
    const loginUrl = 'http://localhost:3000/auth/login';
    console.log('Logging in with 123456...');
    let loginRes = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@minhaempresa.com', password: '123456' }),
    });
    if (!loginRes.ok) {
        console.log('Login failed with 123456, status:', loginRes.status);
        const text = await loginRes.text();
        console.log('Response:', text);
        return;
    }
    const loginData = await loginRes.json();
    const token = loginData.accessToken;
    console.log('Login success, token obtained.');
    console.log('Fetching groups...');
    const groupsRes = await fetch('http://localhost:3000/groups', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!groupsRes.ok) {
        console.error('Failed to fetch groups:', groupsRes.status);
        console.log(await groupsRes.text());
        return;
    }
    const groups = await groupsRes.json();
    console.log(`Found ${groups.length} groups.`);
    if (groups.length === 0) {
        console.log('No groups to update.');
        return;
    }
    const group = groups[0];
    console.log(`Updating group ${group.id} (${group.name})...`);
    const updateUrl = `http://localhost:3000/groups/${group.id}`;
    const updateBody = {
        name: group.name + ' Updated',
        permissions: [permissions_1.Permission.TRANSACTION_VIEW, permissions_1.Permission.USER_VIEW]
    };
    const updateRes = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateBody)
    });
    console.log('Update Status:', updateRes.status);
    const updateText = await updateRes.text();
    console.log('Update Response:', updateText);
}
run().catch(console.error);
//# sourceMappingURL=reproduce-group-update.js.map