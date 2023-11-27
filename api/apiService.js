/*
This is a generated file. Do not edit it directly!
To change the contents of this file, edit api/apiServiceGenerator.js instead.
*/

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export async function createExpense(data) {
  try {
    const response = await fetch(`${API_URL}/expense/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function getExpense(data) {
  try {
    const response = await fetch(`${API_URL}/expense/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function updateExpense(data) {
  try {
    const response = await fetch(`${API_URL}/expense/update`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function deleteExpense(data) {
  try {
    const response = await fetch(`${API_URL}/expense/delete`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function createIncome(data) {
  try {
    const response = await fetch(`${API_URL}/income/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function getIncome(data) {
  try {
    const response = await fetch(`${API_URL}/income/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function updateIncome(data) {
  try {
    const response = await fetch(`${API_URL}/income/update`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function deleteIncome(data) {
  try {
    const response = await fetch(`${API_URL}/income/delete`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function createTag(data) {
  try {
    const response = await fetch(`${API_URL}/tag/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function getAllTag(data) {
  try {
    const response = await fetch(`${API_URL}/tag/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function getTag(data) {
  try {
    const response = await fetch(`${API_URL}/tag/:id`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function updateTag(data) {
  try {
    const response = await fetch(`${API_URL}/tag/update`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function deleteTag(data) {
  try {
    const response = await fetch(`${API_URL}/tag/delete`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function createUser(data) {
  try {
    const response = await fetch(`${API_URL}/user/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function getUser(data) {
  try {
    const response = await fetch(`${API_URL}/user/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function updateUser(data) {
  try {
    const response = await fetch(`${API_URL}/user/update`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function deleteUser(data) {
  try {
    const response = await fetch(`${API_URL}/user/delete`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function login(data) {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}

export async function logout(data) {
  try {
    const response = await fetch(`${API_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}
