/**
 * Comprehensive test script for all Blossom API operations
 * Tests only safe operations (read-only) and file uploads with test data
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ⚠️ SECURITY: Replace with your actual credentials
// These should be loaded from environment variables or .env file
const BASE_URL = process.env.BLOSSOM_BASE_URL || 'your-instance.blossom-kc.com';
const USERNAME = process.env.BLOSSOM_USERNAME || 'YOUR_USERNAME';
const PASSWORD = process.env.BLOSSOM_PASSWORD || 'YOUR_PASSWORD';
const DOMAIN = parseInt(process.env.BLOSSOM_DOMAIN || '1', 10);

// Test results storage
const testResults = {
	passed: [],
	failed: [],
	skipped: [],
};

// Helper function to make authenticated requests
function makeRequest(path, method = 'GET', body = null, formData = null) {
	return new Promise((resolve, reject) => {
		const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

		const options = {
			hostname: BASE_URL,
			path: path,
			method: method,
			headers: {
				Authorization: `Basic ${auth}`,
				Accept: 'application/json',
			},
		};

		if (formData) {
			// For multipart/form-data, don't set Content-Type (let it be set automatically with boundary)
			Object.assign(options.headers, formData.getHeaders());
		} else if (body) {
			options.headers['Content-Type'] = 'application/json';
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

		if (formData) {
			formData.pipe(req);
		} else if (body) {
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
		const success = response.statusCode === 200;
		const result = {
			name: 'Test Connection',
			endpoint: '/WebServices/sync_2/Test',
			method: 'GET',
			status: success ? 'PASS' : 'FAIL',
			statusCode: response.statusCode,
			response: response.body,
		};
		if (success) {
			testResults.passed.push(result);
		} else {
			testResults.failed.push(result);
		}
		console.log(`Status: ${response.statusCode}`);
		console.log('Response:', JSON.stringify(response.body, null, 2));
		return result;
	} catch (error) {
		const result = {
			name: 'Test Connection',
			endpoint: '/WebServices/sync_2/Test',
			method: 'GET',
			status: 'FAIL',
			error: error.message,
		};
		testResults.failed.push(result);
		console.error('Error:', error.message);
		return result;
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
		const success = response.statusCode === 200;
		const result = {
			name: 'Get Groups',
			endpoint: '/WebServices/api_remote/groups',
			method: 'POST',
			status: success ? 'PASS' : 'FAIL',
			statusCode: response.statusCode,
			response: Array.isArray(response.body) ? `${response.body.length} groups` : response.body,
		};
		if (success) {
			testResults.passed.push(result);
		} else {
			testResults.failed.push(result);
		}
		console.log(`Status: ${response.statusCode}`);
		console.log('Response:', Array.isArray(response.body) ? `${response.body.length} groups returned` : JSON.stringify(response.body, null, 2));
		return result;
	} catch (error) {
		const result = {
			name: 'Get Groups',
			endpoint: '/WebServices/api_remote/groups',
			method: 'POST',
			status: 'FAIL',
			error: error.message,
		};
		testResults.failed.push(result);
		console.error('Error:', error.message);
		return result;
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
		const success = response.statusCode === 200;
		const result = {
			name: 'Get User Completion',
			endpoint: '/WebServices/api_remote/user_completion',
			method: 'POST',
			status: success ? 'PASS' : 'FAIL',
			statusCode: response.statusCode,
			response: Array.isArray(response.body) ? `${response.body.length} users` : response.body,
		};
		if (success) {
			testResults.passed.push(result);
		} else {
			testResults.failed.push(result);
		}
		console.log(`Status: ${response.statusCode}`);
		console.log('Response:', Array.isArray(response.body) ? `${response.body.length} users returned` : JSON.stringify(response.body, null, 2));
		return result;
	} catch (error) {
		const result = {
			name: 'Get User Completion',
			endpoint: '/WebServices/api_remote/user_completion',
			method: 'POST',
			status: 'FAIL',
			error: error.message,
		};
		testResults.failed.push(result);
		console.error('Error:', error.message);
		return result;
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
		const success = response.statusCode === 200;
		const result = {
			name: 'Get Members Status',
			endpoint: '/WebServices/api_remote/members_status',
			method: 'POST',
			status: success ? 'PASS' : 'FAIL',
			statusCode: response.statusCode,
			response: Array.isArray(response.body) ? `${response.body.length} members` : response.body,
		};
		if (success) {
			testResults.passed.push(result);
		} else {
			testResults.failed.push(result);
		}
		console.log(`Status: ${response.statusCode}`);
		console.log('Response:', Array.isArray(response.body) ? `${response.body.length} members returned` : JSON.stringify(response.body, null, 2));
		return result;
	} catch (error) {
		const result = {
			name: 'Get Members Status',
			endpoint: '/WebServices/api_remote/members_status',
			method: 'POST',
			status: 'FAIL',
			error: error.message,
		};
		testResults.failed.push(result);
		console.error('Error:', error.message);
		return result;
	}
}

async function testGetMeetings() {
	console.log('\n=== Test 5: Get Meetings ===');
	try {
		const now = new Date();
		const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		const body = {
			domain: DOMAIN,
			start_date: startDate.toISOString(),
			end_date: endDate.toISOString(),
			filters: {},
		};
		const response = await makeRequest('/WebServices/api_remote/get_meetings', 'POST', body);
		const success = response.statusCode === 200;
		const result = {
			name: 'Get Meetings',
			endpoint: '/WebServices/api_remote/get_meetings',
			method: 'POST',
			status: success ? 'PASS' : 'FAIL',
			statusCode: response.statusCode,
			response: Array.isArray(response.body) ? `${response.body.length} meetings` : response.body,
		};
		if (success) {
			testResults.passed.push(result);
		} else {
			testResults.failed.push(result);
		}
		console.log(`Status: ${response.statusCode}`);
		console.log('Response:', Array.isArray(response.body) ? `${response.body.length} meetings returned` : JSON.stringify(response.body, null, 2));
		return result;
	} catch (error) {
		const result = {
			name: 'Get Meetings',
			endpoint: '/WebServices/api_remote/get_meetings',
			method: 'POST',
			status: 'FAIL',
			error: error.message,
		};
		testResults.failed.push(result);
		console.error('Error:', error.message);
		return result;
	}
}

async function testImportUsersCSV() {
	console.log('\n=== Test 6: Import Users CSV ===');
	try {
		// Read CSV file - try multiple possible paths
		const possiblePaths = [
			path.join(__dirname, '../n8n-nodes-blossom/API/readytoblossom.csv'),
			path.join(__dirname, '../../n8n-nodes-blossom/API/readytoblossom.csv'),
			path.join(process.cwd(), 'n8n-nodes-blossom/API/readytoblossom.csv'),
		];
		
		let csvPath = null;
		let csvContent = null;
		
		for (const testPath of possiblePaths) {
			if (fs.existsSync(testPath)) {
				csvPath = testPath;
				csvContent = fs.readFileSync(testPath, 'utf-8');
				break;
			}
		}
		
		if (!csvContent) {
			throw new Error(`CSV file not found. Tried paths: ${possiblePaths.join(', ')}`);
		}

		// Remove BOM if present
		const cleanContent = csvContent.replace(/^\uFEFF/, '');

		// Use form-data for file upload
		const FormData = require('form-data');
		const formData = new FormData();
		formData.append('sheet_file', Buffer.from(cleanContent, 'utf-8'), {
			filename: 'readytoblossom.csv',
			contentType: 'text/csv; charset=utf-8',
		});

		// Check if CSV contains manager_ou or ou_name columns
		const firstLine = cleanContent.split('\n')[0] || '';
		const hasManagerOu = firstLine.includes('manager_ou') || firstLine.includes('ou_name');
		
		// Build options - always include manager_ou=1 if CSV has these columns
		const options = ['keep_old_values=1'];
		if (hasManagerOu) {
			options.push('manager_ou=1');
		}
		
		const endpoint = `/WebServices/sync_2/ImportUsersCSV/${DOMAIN}/${options.join('&')}`;
		const response = await makeRequest(endpoint, 'POST', null, formData);
		
		const success = response.statusCode === 200 && response.body?.res !== 'error';
		const result = {
			name: 'Import Users CSV',
			endpoint: endpoint,
			method: 'POST',
			status: success ? 'PASS' : 'FAIL',
			statusCode: response.statusCode,
			response: response.body,
		};
		if (success) {
			testResults.passed.push(result);
		} else {
			testResults.failed.push(result);
		}
		console.log(`Status: ${response.statusCode}`);
		console.log('Response:', JSON.stringify(response.body, null, 2));
		return result;
	} catch (error) {
		const result = {
			name: 'Import Users CSV',
			endpoint: `/WebServices/sync_2/ImportUsersCSV/${DOMAIN}`,
			method: 'POST',
			status: 'FAIL',
			error: error.message,
		};
		testResults.failed.push(result);
		console.error('Error:', error.message);
		return result;
	}
}

// Run all tests
async function runAllTests() {
	console.log('╔════════════════════════════════════════════════════════════╗');
	console.log('║     BLOSSOM API COMPREHENSIVE TEST SUITE                   ║');
	console.log('╚════════════════════════════════════════════════════════════╝');

	const results = {
		testConnection: await testConnection(),
		testGetGroups: await testGetGroups(),
		testGetUserCompletion: await testGetUserCompletion(),
		testGetMembersStatus: await testGetMembersStatus(),
		testGetMeetings: await testGetMeetings(),
		testImportUsersCSV: await testImportUsersCSV(),
	};

	console.log('\n╔════════════════════════════════════════════════════════════╗');
	console.log('║                    TEST SUMMARY                             ║');
	console.log('╚════════════════════════════════════════════════════════════╝');

	const summary = {
		total: Object.keys(results).length,
		passed: testResults.passed.length,
		failed: testResults.failed.length,
		skipped: testResults.skipped.length,
	};

	console.log(`Total Tests: ${summary.total}`);
	console.log(`Passed: ${summary.passed}`);
	console.log(`Failed: ${summary.failed}`);
	console.log(`Skipped: ${summary.skipped}`);

	// Generate detailed report
	const report = {
		summary,
		passed: testResults.passed,
		failed: testResults.failed,
		skipped: testResults.skipped,
		timestamp: new Date().toISOString(),
	};

	fs.writeFileSync(
		path.join(__dirname, 'TEST_REPORT_DETAILED.json'),
		JSON.stringify(report, null, 2),
		'utf-8',
	);

	console.log('\nDetailed report saved to TEST_REPORT_DETAILED.json');

	return report;
}

// Run tests
runAllTests()
	.then((report) => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('Fatal error:', error);
		process.exit(1);
	});
