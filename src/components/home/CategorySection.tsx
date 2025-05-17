import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

interface CategoryNode {
  id: string;
  name: string;
  image?: string;
  children?: CategoryNode[];
}

const CategoryTree: React.FC = () => {
  // Initialize with an empty Set to keep all categories collapsed by default
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([]));

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const categoryData: CategoryNode[] = [
    {
      id: 'men',
      name: 'Men',
      image: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg',
      children: [
        {
          id: 'men-topwear',
          name: 'Top Wear',
          children: [
            { id: 'men-tshirts', name: 'T-Shirts' },
            { id: 'men-shirts', name: 'Shirts' },
            { id: 'men-sweaters', name: 'Sweaters' }
          ]
        },
        {
          id: 'men-bottomwear',
          name: 'Bottom Wear',
          children: [
            { id: 'men-jeans', name: 'Jeans' },
            { id: 'men-trousers', name: 'Trousers' },
            { id: 'men-shorts', name: 'Shorts' }
          ]
        },
        {
          id: 'men-styles',
          name: 'Styles',
          children: [
            { id: 'men-ethnic', name: 'Ethnic Wear' },
            { id: 'men-casual', name: 'Casual Wear' },
            { id: 'men-formal', name: 'Formal Wear' },
            { id: 'men-sports', name: 'Sports Wear' }
          ]
        }
      ]
    },
    {
      id: 'women',
      name: 'Women',
      image: 'https://images.pexels.com/photos/2294354/pexels-photo-2294354.jpeg',
      children: [
        {
          id: 'women-topwear',
          name: 'Top Wear',
          children: [
            { id: 'women-tops', name: 'Tops' },
            { id: 'women-blouses', name: 'Blouses' },
            { id: 'women-tshirts', name: 'T-Shirts' }
          ]
        },
        {
          id: 'women-bottomwear',
          name: 'Bottom Wear',
          children: [
            { id: 'women-jeans', name: 'Jeans' },
            { id: 'women-skirts', name: 'Skirts' },
            { id: 'women-trousers', name: 'Trousers' }
          ]
        },
        {
          id: 'women-styles',
          name: 'Styles',
          children: [
            { id: 'women-ethnic', name: 'Ethnic Wear' },
            { id: 'women-casual', name: 'Casual Wear' },
            { id: 'women-formal', name: 'Formal Wear' },
            { id: 'women-sports', name: 'Sports Wear' }
          ]
        }
      ]
    },
    {
      id: 'children',
      name: 'Children',
      image: 'https://images.pexels.com/photos/5559986/pexels-photo-5559986.jpeg',
      children: [
        {
          id: 'children-boys',
          name: 'Boys',
          children: [
            { id: 'boys-tshirts', name: 'T-Shirts' },
            { id: 'boys-jeans', name: 'Jeans' },
            { id: 'boys-ethnic', name: 'Ethnic Wear' }
          ]
        },
        {
          id: 'children-girls',
          name: 'Girls',
          children: [
            { id: 'girls-dresses', name: 'Dresses' },
            { id: 'girls-tops', name: 'Tops' },
            { id: 'girls-ethnic', name: 'Ethnic Wear' }
          ]
        },
        {
          id: 'children-styles',
          name: 'Styles',
          children: [
            { id: 'children-casual', name: 'Casual Wear' },
            { id: 'children-school', name: 'School Wear' },
            { id: 'children-sports', name: 'Sports Wear' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categoryData.map((category) => (
          <div key={category.id} className="flex flex-col">
            {/* Root category + its subcategories in one column */}
            <div className="flex flex-col items-center mb-4">
              <div 
                className="flex items-center px-4 py-3 rounded-lg cursor-pointer shadow-md bg-gray-800 text-white z-10 w-full"
                onClick={() => toggleNode(category.id)}
              >
                {category.image && (
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-white">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <span className="font-bold">{category.name}</span>
                <span className="ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                  {expandedNodes.has(category.id) ? '−' : '+'}
                </span>
              </div>
              
              {/* Vertical line connecting to children */}
              {expandedNodes.has(category.id) && category.children && (
                <div className="h-6 w-0.5 bg-gray-400 my-1" />
              )}
            </div>
            
            {/* Subcategories directly below their parent */}
            {expandedNodes.has(category.id) && category.children && (
              <div className="grid grid-cols-1 gap-3 relative pl-4 border-l-2 border-gray-200">
                {category.children.map((subcategory, subIndex) => (
                  <div key={subcategory.id} className="flex flex-col relative">
                    {/* Horizontal line connecting to parent */}
                    <div className="absolute left-0 top-1/2 w-4 h-0.5 bg-gray-300 -translate-y-1/2 -ml-4" />
                    
                    <div 
                      className="px-3 py-2 rounded-md cursor-pointer shadow-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() => toggleNode(subcategory.id)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subcategory.name}</span>
                        <span className="text-sm">
                          {expandedNodes.has(subcategory.id) ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Third level categories (specific items) */}
                    {expandedNodes.has(subcategory.id) && subcategory.children && (
                      <>
                        {/* Vertical line to third level */}
                        <div className="h-4 w-0.5 bg-gray-300 mx-auto my-1" />
                        
                        <div className="ml-4 mt-1 grid grid-cols-2 gap-2 relative pl-2 border-l border-gray-200">
                          {subcategory.children.map((item) => {
                            // Extract category and productType from the item ID
                            const idParts = item.id.split('-');
                            const category = idParts[0];
                            const productType = item.name.replace(/ /g, '');
                            
                            return (
                              <Link 
                                key={item.id}
                                to={`/category/${category}/${productType}`}
                                className="px-3 py-2 bg-white rounded-md text-sm hover:bg-gray-50 border border-gray-100 transition-colors relative"
                              >
                                {/* Horizontal line connecting to parent */}
                                <div className="absolute left-0 top-1/2 w-2 h-0.5 bg-gray-200 -translate-y-1/2 -ml-2" />
                                {item.name}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CategorySection: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 id="categories" className=" text-3xl font-bold mb-3 ">BROWSE CATEGORIES</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our extensive collection organized by gender, clothing type, and style
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <CategoryTree />
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/category/all">
            <Button 
              variant="primary" 
              className="px-6 py-2"
            >
              View All Collections
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;