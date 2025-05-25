import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

interface ProductType {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CategoryNode {
  id: string;
  name: string;
  image?: string;
  children?: CategoryNode[];
  products?: ProductType[];
}

const CategoryTree: React.FC = () => {
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

  // --- Static categoryData as before ---
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
            {
              id: 'men-tshirts',
              name: 'T-Shirts',
              products: [
                { id: 'men-tshirt-1', name: 'Classic Crew Neck', price: 29.99, image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'men-tshirt-2', name: 'Sport Performance Tee', price: 34.99, image: 'https://images.pexels.com/photos/3775120/pexels-photo-3775120.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'men-shirts',
              name: 'Shirts',
              products: [
                { id: 'men-shirt-1', name: 'Oxford Button-Down', price: 49.99, image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'men-shirt-2', name: 'Casual Flannel', price: 39.99, image: 'https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'men-sweaters',
              name: 'Sweaters',
              products: [
                { id: 'men-sweater-1', name: 'Wool Crewneck', price: 59.99, image: 'https://images.pexels.com/photos/10679171/pexels-photo-10679171.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'men-sweater-2', name: 'Cashmere V-Neck', price: 89.99, image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            }
          ]
        },
        {
          id: 'men-bottomwear',
          name: 'Bottom Wear',
          children: [
            {
              id: 'men-jeans',
              name: 'Jeans',
              products: [
                { id: 'men-jeans-1', name: 'Slim Fit Denim', price: 59.99, image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'men-jeans-2', name: 'Relaxed Straight', price: 54.99, image: 'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'men-trousers',
              name: 'Trousers',
              products: [
                { id: 'men-trousers-1', name: 'Chino Pants', price: 49.99, image: 'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'men-trousers-2', name: 'Dress Slacks', price: 69.99, image: 'https://images.pexels.com/photos/6764032/pexels-photo-6764032.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'men-shorts',
              name: 'Shorts',
              products: [
                { id: 'men-shorts-1', name: 'Cargo Shorts', price: 34.99, image: 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'men-shorts-2', name: 'Athletic Shorts', price: 29.99, image: 'https://images.pexels.com/photos/1027160/pexels-photo-1027160.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            }
          ]
        },
        {
          id: 'men-styles',
          name: 'Styles',
          children: [
            {
              id: 'men-ethnic',
              name: 'Ethnic Wear',
              products: [
                { id: 'men-ethnic-1', name: 'Traditional Kurta', price: 79.99, image: 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'men-casual',
              name: 'Casual Wear',
              products: [
                { id: 'men-casual-1', name: 'Graphic Tee', price: 24.99, image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'men-formal',
              name: 'Formal Wear',
              products: [
                { id: 'men-formal-1', name: 'Tailored Suit', price: 299.99, image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'men-sports',
              name: 'Sports Wear',
              products: [
                { id: 'men-sports-1', name: 'Performance Jacket', price: 89.99, image: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            }
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
            {
              id: 'women-tops',
              name: 'Tops',
              products: [
                { id: 'women-tops-1', name: 'Casual Blouse', price: 39.99, image: 'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'women-tops-2', name: 'Sleeveless Top', price: 29.99, image: 'https://images.pexels.com/photos/6765164/pexels-photo-6765164.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'women-blouses',
              name: 'Blouses',
              products: [
                { id: 'women-blouses-1', name: 'Silk Blouse', price: 59.99, image: 'https://images.pexels.com/photos/7691283/pexels-photo-7691283.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'women-blouses-2', name: 'Button-Up Blouse', price: 49.99, image: 'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'women-tshirts',
              name: 'T-Shirts',
              products: [
                { id: 'women-tshirts-1', name: 'V-Neck Tee', price: 24.99, image: 'https://images.pexels.com/photos/6311615/pexels-photo-6311615.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'women-tshirts-2', name: 'Graphic T-Shirt', price: 29.99, image: 'https://images.pexels.com/photos/6311622/pexels-photo-6311622.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            }
          ]
        },
        {
          id: 'women-bottomwear',
          name: 'Bottom Wear',
          children: [
            {
              id: 'women-jeans',
              name: 'Jeans',
              products: [
                { id: 'women-jeans-1', name: 'Skinny Jeans', price: 59.99, image: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'women-jeans-2', name: 'High-Waisted Jeans', price: 64.99, image: 'https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'women-skirts',
              name: 'Skirts',
              products: [
                { id: 'women-skirts-1', name: 'A-Line Skirt', price: 49.99, image: 'https://images.pexels.com/photos/6765164/pexels-photo-6765164.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'women-skirts-2', name: 'Pleated Midi Skirt', price: 54.99, image: 'https://images.pexels.com/photos/6311615/pexels-photo-6311615.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'women-trousers',
              name: 'Trousers',
              products: [
                { id: 'women-trousers-1', name: 'Wide-Leg Pants', price: 59.99, image: 'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'women-trousers-2', name: 'Slim Fit Trousers', price: 54.99, image: 'https://images.pexels.com/photos/6765164/pexels-photo-6765164.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            }
          ]
        },
        {
          id: 'women-styles',
          name: 'Styles',
          children: [
            {
              id: 'women-ethnic',
              name: 'Ethnic Wear',
              products: [
                { id: 'women-ethnic-1', name: 'Embroidered Saree', price: 129.99, image: 'https://images.pexels.com/photos/2531734/pexels-photo-2531734.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'women-casual',
              name: 'Casual Wear',
              products: [
                { id: 'women-casual-1', name: 'Casual Dress', price: 49.99, image: 'https://images.pexels.com/photos/6311615/pexels-photo-6311615.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'women-formal',
              name: 'Formal Wear',
              products: [
                { id: 'women-formal-1', name: 'Business Suit', price: 199.99, image: 'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'women-sports',
              name: 'Sports Wear',
              products: [
                { id: 'women-sports-1', name: 'Yoga Leggings', price: 44.99, image: 'https://images.pexels.com/photos/6311622/pexels-photo-6311622.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            }
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
            {
              id: 'boys-tshirts',
              name: 'T-Shirts',
              products: [
                { id: 'boys-tshirts-1', name: 'Graphic Tee', price: 19.99, image: 'https://images.pexels.com/photos/5560029/pexels-photo-5560029.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'boys-tshirts-2', name: 'Striped T-Shirt', price: 17.99, image: 'https://images.pexels.com/photos/5560019/pexels-photo-5560019.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'boys-jeans',
              name: 'Jeans',
              products: [
                { id: 'boys-jeans-1', name: 'Regular Fit Jeans', price: 29.99, image: 'https://images.pexels.com/photos/5560029/pexels-photo-5560029.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'boys-jeans-2', name: 'Slim Fit Jeans', price: 34.99, image: 'https://images.pexels.com/photos/5560019/pexels-photo-5560019.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'boys-ethnic',
              name: 'Ethnic Wear',
              products: [
                { id: 'boys-ethnic-1', name: 'Festive Kurta Set', price: 49.99, image: 'https://images.pexels.com/photos/5560029/pexels-photo-5560029.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            }
          ]
        },
        {
          id: 'children-girls',
          name: 'Girls',
          children: [
            {
              id: 'girls-dresses',
              name: 'Dresses',
              products: [
                { id: 'girls-dresses-1', name: 'Floral Dress', price: 34.99, image: 'https://images.pexels.com/photos/5560019/pexels-photo-5560019.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'girls-dresses-2', name: 'Party Dress', price: 39.99, image: 'https://images.pexels.com/photos/5560029/pexels-photo-5560029.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'girls-tops',
              name: 'Tops',
              products: [
                { id: 'girls-tops-1', name: 'Casual Top', price: 19.99, image: 'https://images.pexels.com/photos/5560019/pexels-photo-5560019.jpeg?auto=compress&cs=tinysrgb&w=600' },
                { id: 'girls-tops-2', name: 'Printed T-Shirt', price: 17.99, image: 'https://images.pexels.com/photos/5560029/pexels-photo-5560029.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'girls-ethnic',
              name: 'Ethnic Wear',
              products: [
                { id: 'girls-ethnic-1', name: 'Lehenga Choli', price: 59.99, image: 'https://images.pexels.com/photos/5560019/pexels-photo-5560019.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            }
          ]
        },
        {
          id: 'children-styles',
          name: 'Styles',
          children: [
            {
              id: 'children-casual',
              name: 'Casual Wear',
              products: [
                { id: 'children-casual-1', name: 'Everyday Outfit Set', price: 39.99, image: 'https://images.pexels.com/photos/5560029/pexels-photo-5560029.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'children-school',
              name: 'School Wear',
              products: [
                { id: 'children-school-1', name: 'School Uniform Set', price: 49.99, image: 'https://images.pexels.com/photos/5560019/pexels-photo-5560019.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            },
            {
              id: 'children-sports',
              name: 'Sports Wear',
              products: [
                { id: 'children-sports-1', name: 'Sports Jersey', price: 29.99, image: 'https://images.pexels.com/photos/5560029/pexels-photo-5560029.jpeg?auto=compress&cs=tinysrgb&w=600' }
              ]
            }
          ]
        }
      ]
    }
  ];

  // Function to render products
  const renderProducts = (products: ProductType[]) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {products.map(product => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2">
              <h4 className="text-sm font-medium truncate">{product.name}</h4>
              <p className="text-sm text-gray-700">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  // --- Static rendering logic as before ---
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
                            const productType = item.name.replace(/ /g, '').toLowerCase();
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
                    {/* Render products if present */}
                    {expandedNodes.has(subcategory.id) && subcategory.products && renderProducts(subcategory.products)}
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