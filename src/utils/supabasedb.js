import { supabase } from '../lib/supabase'

// ============================================
// USER OPERATIONS
// ============================================

export const addUser = async (user) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error adding user:', error)
    throw error
  }
}

export const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting users:', error)
    return []
  }
}

export const updateUser = async (email, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('email', email)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// ============================================
// RESOURCE OPERATIONS
// ============================================

export const addResource = async (resource) => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .insert([resource])
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error adding resource:', error)
    throw error
  }
}

export const getResources = async () => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('uploadedDate', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting resources:', error)
    return []
  }
}

export const getResourceById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting resource:', error)
    return null
  }
}

export const updateResource = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error updating resource:', error)
    throw error
  }
}

export const deleteResource = async (id) => {
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error deleting resource:', error)
    throw error
  }
}

// ============================================
// REVIEW OPERATIONS
// ============================================

export const addReview = async (review) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error adding review:', error)
    throw error
  }
}

export const getReviews = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('createdAt', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting reviews:', error)
    return []
  }
}

export const getReviewsByResourceId = async (resourceId) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('resourceId', resourceId)
      .order('createdAt', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting reviews:', error)
    return []
  }
}

// ============================================
// INITIALIZATION (No longer needed with Supabase)
// ============================================

export const initializeDB = async () => {
  // No initialization needed for Supabase
  // Tables are created in Supabase dashboard
  return Promise.resolve()
}
