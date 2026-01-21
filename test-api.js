/**
 * Test script for Blossom API read-only operations
 * Tests only query/read operations to avoid data modification
 */

const https = require('https');
const http = require('http');

// ⚠️ SECURITY: Replace with your actual credentials
// These should be loaded from environment variables or .env file
const BASE_URL = process.env.BLOSSOM_BASE_URL || 'your-instance.blossom-kc.com';
const USERNAME = process.env.BLOSSOM_USERNAME || 'YOUR_USERNAME';
const PASSWORD = process.env.BLOSSOM_PASSWORD || 'YOUR_PASSWORD';
const DOMAIN = parseInt(process.env.BLOSSOM_DOMAIN || '1', 10);

// Helper function to make authenticated requests
function makeRequest(path, method = 'GET', body = null) {
	return new Promise((resolve, reject) => {
		const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
		
		const options = {
			hostname: BASE_URL,
			path: path,
			method: method,
			headers: {
				'Authorization': `Basic ${auth}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		};

		if (body) {
			const bodyString = JSON.stringify(body);
			options.headers['Content-Length'] = Buffer.byteLength(bodyString);
		}

		const req = https.request(options, (res) => {
			let data = '';

			res.on('data', (chunk) => {
				data += chunk;
			});

			res.on('end', () => {
				try {
					const json = JSON.parse(data);
					resolve({
						statusCode: res.statusCode,
						headers: res.headers,
						body: json,
					});
				} catch (e) {
					resolve({
						statusCode: res.statusCode,
						headers: res.headers,
						body: data,
					});
				}
			});
		});

		req.on('error', (error) => {
			reject(error);
		});

		if (body) {
			req.write(JSON.stringify(body));
		}

		req.end();
	});
}

// Test functions
async function testConnection() {
	console.log('\n=== Test 1: Connection Test ===');
	try {
		const response = await makeRequest('/WebServices/sync_2/Test', 'GET');
		console.log('Status:', response.statusCode);
		console.log('Response:', JSON.stringify(response.body, null, 2));
		return { success: response.statusCode === 200, response };
	} catch (error) {
		console.error('Error:', error.message);
		return { success: false, error: error.message };
	}
}

async function testGetGroups() {
	console.log('\n=== Test 2: Get Groups ===');
	try {
		const body = {
			as_array: 1,
			domain: DOMAIN,
			filters: {
				type: 'qualification',
			},
		};
		const response = await makeRequest('/WebServices/api_remote/groups', 'POST', body);
		console.log('Status:', response.statusCode);
		console.log('Response:', JSON.stringify(response.body, null, 2));
		return { success: response.statusCode === 200, response };
	} catch (error) {
		console.error('Error:', error.message);
		return { success: false, error: error.message };
	}
}

async function testGetUserCompletion() {
	console.log('\n=== Test 3: Get User Completion ===');
	try {
		const body = {
			domain: DOMAIN,
			start_date: '2020-01-01',
			end_date: '2030-01-01',
			types: 'Courses',
			filters: {},
		};
		const response = await makeRequest('/WebServices/api_remote/user_completion', 'POST', body);
		console.log('Status:', response.statusCode);
		console.log('Response:', JSON.stringify(response.body, null, 2));
		return { success: response.statusCode === 200, response };
	} catch (error) {
		console.error('Error:', error.message);
		return { success: false, error: error.message };
	}
}

async function testGetMembersStatus() {
	console.log('\n=== Test 4: Get Members Status ===');
	try {
		const body = {
			domain: DOMAIN,
			start_date: '-24 hours',
			group: {
				group_type: 'course',
			},
		};
		const response = await makeRequest('/WebServices/api_remote/members_status', 'POST', body);
		console.log('Status:', response.statusCode);
		console.log('Response:', JSON.stringify(response.body, null, 2));
		return { success: response.statusCode === 200, response };
	} catch (error) {
		console.error('Error:', error.message);
		return { success: false, error: error.message };
	}
}

async function testGetMeetings() {
	console.log('\n=== Test 5: Get Meetings ===');
	try {
		const now = new Date();
		const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
		const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

		const body = {
			domain: DOMAIN,
			start_date: startDate.toISOString(),
			end_date: endDate.toISOString(),
			filters: {},
		};
		const response = await makeRequest('/WebServices/api_remote/get_meetings', 'POST', body);
		console.log('Status:', response.statusCode);
		console.log('Response:', JSON.stringify(response.body, null, 2));
		return { success: response.statusCode === 200, response };
	} catch (error) {
		console.error('Error:', error.message);
		return { success: false, error: error.message };
	}
}

// Run all tests
async function runAllTests() {
	console.log('╔════════════════════════════════════════════════════════════╗');
	console.log('║     BLOSSOM API READ-ONLY OPERATIONS TEST SUITE             ║');
	console.log('╚════════════════════════════════════════════════════════════╝');

	const results = {
		testConnection: await testConnection(),
		testGetGroups: await testGetGroups(),
		testGetUserCompletion: await testGetUserCompletion(),
		testGetMembersStatus: await testGetMembersStatus(),
		testGetMeetings: await testGetMeetings(),
	};

	console.log('\n╔════════════════════════════════════════════════════════════╗');
	console.log('║                    TEST SUMMARY                             ║');
	console.log('╚════════════════════════════════════════════════════════════╝');

	const summary = {
		total: Object.keys(results).length,
		passed: Object.values(results).filter((r) => r.success).length,
		failed: Object.values(results).filter((r) => !r.success).length,
	};

	console.log(`Total Tests: ${summary.total}`);
	console.log(`Passed: ${summary.passed}`);
	console.log(`Failed: ${summary.failed}`);

	Object.entries(results).forEach(([name, result]) => {
		const status = result.success ? '✅ PASS' : '❌ FAIL';
		console.log(`${status} - ${name}`);
		if (!result.success && result.error) {
			console.log(`   Error: ${result.error}`);
		}
	});

	return results;
}

// Run tests
runAllTests()
	.then((results) => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('Fatal error:', error);
		process.exit(1);
	});
