table "movies" do
	column "idmovies", :key
	#column "idmovies", :integer
	column "title", :string
	column "year", :integer
	column "number", :integer
	column "type", :integer
	column "location", :string
	column "language", :string
end

table "aka_titles", :embed_in => :movies, :on => :idmovies  do
	column "idaka_titles", :key
	column "idmovies", :integer, :references => :movies
	column "title", :string
	column "location", :string
	column "year", :integer
end

# GENRES
table "movies_genres", :embed_in => :movies, :on => :idmovies  do
	column "idmovies_genres", :key
	column "idmovies", :integer, :references => :movies
	column "idgenres", :integer
	column "idseries", :integer
end

# KEYWORDS
table "movies_keywords", :embed_in => :movies, :on => :idmovies  do
	column "idmovies_keywords", :key
	column "idmovies", :integer, :references => :movies
	column "idkeywords", :integer
	column "idseries", :integer
end